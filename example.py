from crewai import Crew, Agent, Task
from waste_detection import classify_waste  # YOLOv8 waste classification
from legal_compliance import check_regulations  # RAG-based law retrieval
from response_generator import generate_response  # GPT-4 response + TTS

# Define the AI Agents
waste_detection_agent = Agent(
    name="Waste Detection Agent",
    role="Identifies and classifies medical waste from images",
    function=classify_waste
)

legal_compliance_agent = Agent(
    name="Legal Compliance Agent",
    role="Retrieves legal regulations for the classified waste",
    function=check_regulations
)

response_agent = Agent(
    name="Response Agent",
    role="Generates a response and provides voice output",
    function=generate_response
)

# Define the Workflow Tasks
detect_waste_task = Task(
    agent=waste_detection_agent,
    description="Analyze the uploaded waste image and classify the waste type."
)

fetch_regulations_task = Task(
    agent=legal_compliance_agent,
    description="Retrieve the correct disposal regulations based on the waste classification."
)

respond_to_user_task = Task(
    agent=response_agent,
    description="Generate a user-friendly response with disposal guidelines and convert it to speech."
)

# Create the Crew (Orchestration)
medwaste_guardian_crew = Crew(
    agents=[waste_detection_agent, legal_compliance_agent, response_agent],
    tasks=[detect_waste_task, fetch_regulations_task, respond_to_user_task]
)

# Run the Crew Workflow
def process_medical_waste(image_path):
    result = medwaste_guardian_crew.kickoff(inputs={"image": image_path})
    return result

# Example Usage
if __name__ == "__main__":
    image_path = "path/to/waste_image.jpg"
    response = process_medical_waste(image_path)
    print(response)
