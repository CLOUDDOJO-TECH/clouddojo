#!/usr/bin/env python3
"""
Alternative AWS Exam PDF Extractor
---------------------------------
Uses PyPDF2 to extract text from PDFs and applies robust parsing for AWS exam questions.
"""

import re
import json
import logging
import argparse
from pathlib import Path
import PyPDF2

# Set up logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

def extract_text_with_pypdf2(pdf_path):
    """Extract text from PDF using PyPDF2."""
    logger.info(f"Extracting text from {pdf_path} using PyPDF2")
    
    try:
        with open(pdf_path, 'rb') as file:
            reader = PyPDF2.PdfReader(file)
            logger.info(f"PDF has {len(reader.pages)} pages")
            
            full_text = ""
            for i, page in enumerate(reader.pages):
                text = page.extract_text()
                if text:
                    full_text += f"\nPAGE{i+1}\n" + text + "\n"
                
                # Log sample from first pages
                if i < 2:
                    logger.debug(f"Sample from page {i+1}:\n{text[:150]}...")
        
        if not full_text.strip():
            logger.error("No text extracted from PDF")
            return ""
        
        return full_text
    except Exception as e:
        logger.error(f"Failed to extract text from PDF: {str(e)}")
        raise

def clean_and_format_text(text):
    """Apply robust text cleaning and formatting fixes."""
    # Normalize line breaks and remove excessive whitespace
    text = re.sub(r'\n\s*\n+', '\n', text).strip()
    text = re.sub(r'\s+', ' ', text)
    
    # Fix merged words with common AWS patterns
    text = re.sub(r'([a-z])([A-Z])', r'\1 \2', text)
    text = re.sub(r'Amazon(?=[A-Z])', r'Amazon ', text)
    text = re.sub(r'AWS(?=[A-Z])', r'AWS ', text)
    
    # Fix specific terms
    text = text.replace('Correctanswer', 'Correct answer')
    text = text.replace('Overallexplanation', 'Overall explanation')
    
    # Ensure proper question separation
    text = re.sub(r'([^\n])Question\s*(\d+)', r'\1\nQuestion \2', text)
    text = re.sub(r'^Question\s*(\d+)', r'Question \1', text)
    
    # Fix option formatting
    text = re.sub(r'([A-D])\.([\S])', r'\1. \2', text)
    text = re.sub(r'([^\n])([A-D]\.\s+)', r'\1\n\2', text)
    
    # Ensure markers are on new lines
    text = re.sub(r'([^\n])(Correct answer|Overall explanation|Explanation:)', r'\1\n\2', text)
    
    return text

def split_into_questions(text):
    """Split text into individual questions with page context."""
    # Skip introductory content
    intro_match = re.search(r'QUESTIONS\s*(\n|Question)', text, re.IGNORECASE)
    if intro_match:
        text = text[intro_match.start():]
    
    # Split by question markers
    question_pattern = r'(Question\s*\d+)'
    chunks = re.split(question_pattern, text)
    
    questions = []
    current_question = None
    
    for i, chunk in enumerate(chunks):
        if re.match(r'Question\s*\d+', chunk):
            if current_question:
                questions.append(current_question)
            current_question = chunk
        elif current_question:
            current_question += chunk
    
    # Append the last question
    if current_question:
        questions.append(current_question)
    
    logger.info(f"Split into {len(questions)} question chunks")
    return questions

def parse_question(text):
    """Parse a single question into structured data."""
    # Extract question number
    num_match = re.search(r'Question\s*(\d+)', text)
    if not num_match:
        logger.warning(f"Could not find question number in: {text[:100]}...")
        return None
    
    question_number = num_match.group(1)
    
    # Handle skipped questions
    if "Skipped" in text[:200]:
        logger.info(f"Question {question_number} is marked as skipped")
        return None
    
    # Extract question text
    q_end_pattern = r'(?=\n\s*[A-D]\.\s)'
    q_match = re.search(r'Question\s*\d+\s*(.*?)(?=\n\s*[A-D]\.\s|$)', text, re.DOTALL)
    if not q_match:
        logger.warning(f"Could not extract question text for Question {question_number}")
        return None
    
    question_text = q_match.group(1).strip()
    
    # Extract options
    options = []
    option_pattern = r'([A-D])\.\s*(.*?)(?=\n\s*[A-D]\.\s|\n\s*Correct answer|\n\s*(?:Overall explanation|Explanation:)|$)'
    
    for match in re.finditer(option_pattern, text, re.DOTALL):
        content = match.group(2).strip()
        options.append(content)
    
    # Ensure all options are captured
    expected_options = 4  # Adjust based on your PDF (most have 4 options)
    if len(options) < expected_options:
        remaining_text = text[q_match.end():]
        for letter in "ABCD"[len(options):]:
            specific_pattern = fr'{letter}\.\s*(.*?)(?=\n\s*[A-Z]\.\s|\n\s*Correct answer|\n\s*(?:Overall explanation|Explanation:)|$)'
            specific_match = re.search(specific_pattern, remaining_text, re.DOTALL)
            if specific_match:
                options.append(specific_match.group(1).strip())
            else:
                options.append("")  # Placeholder for missing option
    
    # Extract correct answer(s)
    correct_answer = None
    ca_matches = list(re.finditer(r'Correct answer\s*([A-D])', text, re.IGNORECASE))
    if ca_matches:
        if len(ca_matches) > 1:  # Multi-answer question
            correct_answer = [match.group(1) for match in ca_matches]
        else:
            correct_answer = ca_matches[0].group(1)
    else:
        # Check options for embedded marker
        for i, opt in enumerate(options):
            if "Correct answer" in opt:
                correct_answer = chr(65 + i)  # A=65, B=66, etc.
                options[i] = opt.replace("Correct answer", "").strip()
                break
    
    # Extract explanation
    expl_pattern = r'(Overall explanation|Explanation:)\s*(.*?)(?=\n\s*Question\s*\d+|$|\n\s*PAGE\d+)'
    expl_match = re.search(expl_pattern, text, re.DOTALL)
    explanation = expl_match.group(2).strip() if expl_match else ""
    
    return {
        "number": question_number,
        "text": question_text,
        "options": options,
        "correct_answer": correct_answer,
        "explanation": explanation
    }

def save_as_json(questions, output_file):
    """Save parsed questions to a JSON file."""
    try:
        output_path = Path(output_file)
        output_path.parent.mkdir(parents=True, exist_ok=True)
        
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(questions, f, indent=2, ensure_ascii=False)
        
        logger.info(f"Successfully saved {len(questions)} questions to {output_file}")
    except Exception as e:
        logger.error(f"Error saving to JSON: {str(e)}")
        raise

def main():
    parser = argparse.ArgumentParser(description="Alternative AWS Exam Question Extractor")
    parser.add_argument("pdf_path", help="Path to the PDF file containing AWS exam questions")
    parser.add_argument("--output", "-o", help="Output JSON file path (default: extracted_questions.json)", 
                       default="extracted_questions.json")
    parser.add_argument("--debug", "-d", action="store_true", help="Enable debug mode")
    args = parser.parse_args()
    
    if args.debug:
        logger.setLevel(logging.DEBUG)
    
    try:
        # Extract raw text from PDF
        raw_text = extract_text_with_pypdf2(args.pdf_path)
        if not raw_text:
            return 1
        
        # Clean and format the text
        formatted_text = clean_and_format_text(raw_text)
        
        # Split into individual questions
        question_chunks = split_into_questions(formatted_text)
        
        if not question_chunks:
            logger.error("Could not identify any questions in the PDF")
            return 1
        
        # Parse each question
        parsed_questions = []
        for i, chunk in enumerate(question_chunks):
            try:
                question = parse_question(chunk)
                if question:
                    parsed_questions.append(question)
                    if i < 2 or (i > 0 and i % 20 == 0):
                        logger.info(f"Parsed Question {question['number']}: {question['text'][:50]}...")
            except Exception as e:
                logger.error(f"Error parsing question chunk {i+1}: {str(e)}")
                logger.debug(f"Problematic chunk: {chunk[:200]}...")
        
        if not parsed_questions:
            logger.error("Failed to parse any questions from the PDF")
            return 1
        
        # Save to JSON
        save_as_json(parsed_questions, args.output)
        
        logger.info(f"Extraction complete. Saved {len(parsed_questions)} questions to {args.output}")
        
    except Exception as e:
        logger.error(f"Error processing PDF: {str(e)}")
        return 1
    
    return 0

if __name__ == "__main__":
    exit(main())