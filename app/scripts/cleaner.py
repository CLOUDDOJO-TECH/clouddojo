#!/usr/bin/env python3
"""
JSON Cleaner for AWS Exam Questions
----------------------------------
Cleans and fixes formatting issues in extracted AWS exam questions.
"""

import re
import json
import logging
import argparse
from pathlib import Path

# Set up logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

def load_json(file_path):
    """Load JSON data from a file."""
    logger.info(f"Loading JSON from {file_path}")
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        # Handle different JSON structures
        if isinstance(data, dict) and 'questions' in data:
            questions = data['questions']
        elif isinstance(data, list):
            questions = data
        else:
            logger.error("Unexpected JSON structure")
            return []
        
        logger.info(f"Loaded {len(questions)} questions")
        return questions
    except Exception as e:
        logger.error(f"Error loading JSON: {str(e)}")
        raise

def clean_text(text, preserve_newlines=False):
    """Remove excessive newlines and fix spacing."""
    if not text:
        return ""
    
    if preserve_newlines:
        # Preserve intentional newlines, collapse multiples
        text = re.sub(r'\n\s*\n+', '\n', text).strip()
    else:
        # Replace newlines with spaces
        text = text.replace('\n', ' ')
    
    # Fix extra spaces
    text = re.sub(r'\s+', ' ', text).strip()
    
    # Fix punctuation spacing
    text = text.replace(' .', '.').replace(' ,', ',')
    
    # Fix common merged words
    text = re.sub(r'([a-z])([A-Z])', r'\1 \2', text)
    # Specific AWS terms
    text = re.sub(r'Amazon(?=[A-Z])', r'Amazon ', text)
    text = re.sub(r'AWS(?=[A-Z])', r'AWS ', text)
    
    return text.strip()

def extract_correct_answer(options, existing_answer):
    """Extract the correct answer from options or use existing."""
    correct_answer = existing_answer
    
    # Check options for "Correct answer" marker
    for i, text in enumerate(options):
        if "Correct answer" in text:
            letter = chr(65 + i)  # A=65, B=66, etc.
            if isinstance(correct_answer, list):
                correct_answer.append(letter)
            elif correct_answer is None:
                correct_answer = letter
            options[i] = text.replace("Correct answer", "").strip()
    
    return correct_answer, options

def extract_explanation(options, existing_explanation):
    """Extract explanation from options if misplaced."""
    explanation = existing_explanation
    
    # Check last option for explanation markers
    if options and isinstance(options[-1], str):
        last_option = options[-1]
        exp_match = re.search(r'(Overall explanation|Explanation:)\s*(.*)', last_option, re.IGNORECASE)
        if exp_match:
            explanation = exp_match.group(2).strip()
            options[-1] = last_option[:exp_match.start()].strip()
    
    return explanation, options

def fix_empty_options(options):
    """Fix empty options by redistributing text from adjacent options."""
    cleaned_options = options.copy()
    
    # Identify empty options
    empty_indices = [i for i, opt in enumerate(cleaned_options) if not opt.strip()]
    
    if not empty_indices:
        return cleaned_options
    
    # Try to redistribute from previous non-empty option
    for idx in empty_indices:
        if idx > 0:
            prev_text = cleaned_options[idx - 1]
            # Look for potential option split (e.g., "A. text B. text")
            split_match = re.search(r'([A-D])\.\s*(.*)$', prev_text, re.IGNORECASE)
            if split_match:
                letter = split_match.group(1)
                if ord(letter) - 65 == idx:  # Matches expected letter
                    cleaned_options[idx - 1] = prev_text[:split_match.start()].strip()
                    cleaned_options[idx] = f"{letter}. {split_match.group(2).strip()}"
    
    return cleaned_options

def clean_questions(questions):
    """Clean and fix formatting issues in questions."""
    cleaned_questions = []
    
    for q in questions:
        try:
            # Clean question text (preserve newlines optional)
            q_text = clean_text(q['text'], preserve_newlines=False)
            
            # Convert options list to cleaned list
            options = [clean_text(opt, preserve_newlines=False) for opt in q['options']]
            
            # Fix empty options
            options = fix_empty_options(options)
            
            # Extract correct answer and clean options
            correct_answer, options = extract_correct_answer(options, q['correct_answer'])
            
            # Extract explanation if misplaced in options
            explanation, options = extract_explanation(options, q['explanation'])
            explanation = clean_text(explanation, preserve_newlines=True)
            
            # Create cleaned question object
            cleaned_q = {
                'number': q['number'],
                'text': q_text,
                'options': options,
                'correct_answer': correct_answer,
                'explanation': explanation
            }
            
            cleaned_questions.append(cleaned_q)
            logger.info(f"Cleaned question {q['number']}")
            
        except Exception as e:
            logger.error(f"Error cleaning question {q.get('number', 'unknown')}: {str(e)}")
            continue  # Skip problematic questions
    
    return cleaned_questions

def save_json(questions, output_file):
    """Save questions to a JSON file."""
    logger.info(f"Saving {len(questions)} questions to {output_file}")
    
    try:
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(questions, f, indent=2, ensure_ascii=False)
        
        logger.info(f"Successfully saved to {output_file}")
    except Exception as e:
        logger.error(f"Error saving JSON: {str(e)}")
        raise

def main():
    parser = argparse.ArgumentParser(description="Clean and fix formatting in AWS exam questions JSON")
    parser.add_argument("input_file", help="Path to the input JSON file with AWS exam questions")
    parser.add_argument("--output", "-o", help="Output JSON file path (default: cleaned_questions.json)", 
                       default="cleaned_questions.json")
    parser.add_argument("--debug", "-d", action="store_true", help="Enable debug mode")
    args = parser.parse_args()
    
    if args.debug:
        logger.setLevel(logging.DEBUG)
    
    try:
        # Load questions from JSON
        questions = load_json(args.input_file)
        
        if not questions:
            logger.error("No questions found in the input file")
            return 1
        
        # Clean questions
        cleaned_questions = clean_questions(questions)
        
        if not cleaned_questions:
            logger.error("Failed to clean any questions")
            return 1
        
        # Save cleaned questions
        save_json(cleaned_questions, args.output)
        
        logger.info(f"Process completed. Cleaned {len(cleaned_questions)} questions")
        
    except Exception as e:
        logger.error(f"Error processing JSON: {str(e)}")
        return 1
    
    return 0

if __name__ == "__main__":
    exit(main())