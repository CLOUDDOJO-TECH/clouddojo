import re
import json
import os
import sys
import pdfplumber

def parse_pdf(file_path):
    """Extract and parse questions from a PDF file with compact formatting."""
    if not os.path.exists(file_path):
        print(f"Error: File '{file_path}' not found")
        sys.exit(1)

    # Extract text from PDF
    try:
        with pdfplumber.open(file_path) as pdf:
            text = ""
            for page in pdf.pages:
                page_text = page.extract_text()
                if page_text:
                    text += page_text + "\n"
            if not text.strip():
                print("Error: No text extracted from PDF")
                sys.exit(1)
            print("Extracted text (first 1000 characters):")
            print(text[:1000])
            print("Total extracted characters:", len(text))
    except Exception as e:
        print(f"Error reading PDF: {e}")
        sys.exit(1)

    questions = []
    # Pattern to capture each question block
    question_pattern = r"Question\s*(\d+)\s*(.*?)(?=Question\s*\d+|$)"  # Until next Question or end
    option_pattern = r"([A-D])\.\s*(.*?)(?=(?:[A-D]\.\s*|Correctanswer|Overallexplanation|Explanation:|$))"  # Until next option, Correctanswer, or explanation
    explanation_pattern = r"(Overallexplanation|Explanation:)\s*(.*?)(?=Question\s*\d+|$)"  # Until next Question or end

    print("Starting parsing...")

    # Find all question blocks
    question_matches = re.finditer(question_pattern, text, re.DOTALL)
    question_count = 0

    def clean_text(text):
        """Add spaces between merged words."""
        text = re.sub(r"([a-z])([A-Z])", r"\1 \2", text)  # Basic split (e.g., "AWSLambdafunction" -> "AWS Lambdafunction")
        # Improve common AWS terms
        text = re.sub(r"AWS(?=[A-Z])", r"AWS ", text)  # "AWSLambda" -> "AWS Lambda"
        text = re.sub(r"Amazon(?=[A-Z])", r"Amazon ", text)  # "AmazonS3" -> "Amazon S3"
        return text.strip()

    for match in question_matches:
        question_count += 1
        q_num = match.group(1)
        q_block = match.group(2).strip()
        print(f"Parsing Question {q_num}")

        # Extract question text (before first option)
        q_text_end = re.search(r"[A-D]\.\s*", q_block)
        q_text = q_block[:q_text_end.start()].strip() if q_text_end else q_block.strip()
        q_text = clean_text(q_text)

        # Extract options and detect correct answer
        options = []
        correct_answer = None
        opt_matches = re.finditer(option_pattern, q_block, re.DOTALL)
        for opt_match in opt_matches:
            opt_letter = opt_match.group(1)
            opt_text = opt_match.group(2).strip()
            if "Correctanswer" in opt_text:
                correct_answer = opt_letter
                opt_text = opt_text.split("Correctanswer")[0].strip()  # Take text before Correctanswer
            options.append(clean_text(opt_text))

        # Extract explanation
        exp_match = re.search(explanation_pattern, q_block, re.DOTALL)
        explanation = exp_match.group(2).strip() if exp_match else ""
        explanation = clean_text(explanation)

        questions.append({
            "number": q_num,
            "text": q_text,
            "options": options,
            "correct_answer": correct_answer,
            "explanation": explanation
        })

    print(f"Parsed {len(questions)} questions successfully (Found {question_count} matches)")
    if questions:
        print("Sample question:", json.dumps(questions[0], indent=2))
        if len(questions) > 1:
            print("Second question:", json.dumps(questions[1], indent=2))

    return questions

def save_to_json(questions, output_dir="../data", output_file="questions.json"):
    """Save parsed questions to a JSON file."""
    output_path = os.path.join(output_dir, output_file)
    try:
        os.makedirs(output_dir, exist_ok=True)
        with open(output_path, "w", encoding="utf-8") as f:
            json.dump(questions, f, indent=2)
        print(f"Questions saved to {output_path}")
    except Exception as e:
        print(f"Error saving to JSON file: {e}")

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python parser.py <pdf_file_path>")
        sys.exit(1)

    pdf_file_path = sys.argv[1]
    questions = parse_pdf(pdf_file_path)
    save_to_json(questions)

    print("Script completed")