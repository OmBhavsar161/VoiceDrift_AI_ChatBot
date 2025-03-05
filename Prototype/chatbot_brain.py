import re

Greeting_list = ["hi", "hii", "hiii", "hello", "hey", "hi there", "delta"]
Goodbye_list = ["exit", "quit", "bye"]
Deny_list = ["no", "not", "never", "none", "nn", "n"]
Affirm_list = ["yes", "ofcourse", "why not", "y", "yy", "yeah", "yup", "sure", "absolutely", "definitely", "certainly", "ok", "okay", "indeed", "right", "true", "affirmative", "correct", "exactly"]
Repeat_list = ["repeat", "repeat again", "can't hear", "repeat yourself", "say again"]

class VoiceDriftChatbot:
    def __init__(self):
        self.responses = {
            "water_level": self.water_level_response,
            "hydrogeological_scenario": self.hydrogeological_scenario_response,
            "water_quality": self.water_quality_response,
            "available_reports": self.available_reports_response,
            "generate_report": self.generate_report_response,
            "noc_conditions": self.noc_conditions_response,
            "noc_guidance": self.noc_guidance_response,
            "groundwater_terms": self.groundwater_terms_response,
            "training_opportunities": self.training_opportunities_response,
            "default": self.default_response
        }

    def water_level_response(self):
        return "The water level scenario depends on the aquifer type, recharge rates, and extraction patterns. For specific data, please refer to the latest groundwater assessment report for your area."

    def hydrogeological_scenario_response(self):
        return "The hydrogeological scenario includes information about aquifer properties, groundwater flow, and recharge mechanisms. Detailed studies are required for accurate assessment."

    def water_quality_response(self):
        return "Water quality is assessed based on parameters like pH, TDS, hardness, and contamination levels. Regular monitoring is essential to ensure safe water usage."

    def available_reports_response(self):
        return "Available reports include Groundwater Resource Assessment Reports, Water Quality Reports, and Hydrogeological Studies. Contact your local groundwater authority for access."

    def generate_report_response(self):
        report = """
        Comprehensive Groundwater Report:<br />
        1. Groundwater Resource Assessment: Includes recharge rates, extraction data, and sustainability analysis.<br />
        2. Categorization of the Area: Classified as Safe, Semi-Critical, Critical, or Over-Exploited based on groundwater usage.<br />
        3. Groundwater Management Practices: Recommendations for rainwater harvesting, artificial recharge, and sustainable extraction.<br />
        4. NOC Conditions: Conditions for obtaining NOC include permissible extraction limits, purpose of use, and compliance with regulations.<br />
        5. How to Obtain NOC: Submit an application to the groundwater authority with required documents like site details, extraction purpose, and hydrogeological report.<br />
        6. Groundwater Terms: Definitions of terms like Aquifer, Recharge, Water Table, and Piezometric Surface.<br />
        7. Training Opportunities: Workshops and courses on groundwater management are offered by institutions like CGWB and NIH.
        """
        return report

    def noc_conditions_response(self):
        return "Conditions for obtaining NOC include permissible extraction limits, purpose of use (domestic/industrial/agricultural), and compliance with groundwater regulations."

    def noc_guidance_response(self):
        return "To obtain NOC, submit an application to the groundwater authority with required documents like site details, extraction purpose, and hydrogeological report."

    def groundwater_terms_response(self):
        return """
        Groundwater Terms:<br />
        1. Aquifer: A body of permeable rock that can contain or transmit groundwater.<br />
        2. Recharge: The process by which water enters an aquifer.<br />
        3. Water Table: The upper surface of the zone of saturation.<br />
        4. Piezometric Surface: The level to which water will rise in a well.
        """

    def training_opportunities_response(self):
        return "Training opportunities include workshops and courses offered by institutions like the Central Ground Water Board (CGWB) and National Institute of Hydrology (NIH)."

    def default_response(self):
        return "I'm sorry, I didn't understand your query.<br />Please ask about water levels, hydrogeological scenarios, water quality, available reports, NOC conditions, NOC Guidance, Ground Water terms, Ground Water Report."

    def repeat_response(self):
        return "You can ask me about water levels, hydrogeological scenarios, water quality, available reports, NOC conditions, NOC Guidance, Ground Water terms, Ground Water Report."

    def get_response(self, user_input):
        user_input = user_input.lower()
        if user_input in Repeat_list:
            return self.repeat_response()
        if re.search(r"water level|level of water|depth of water|groundwater depth", user_input):
            return self.responses["water_level"]()
        elif re.search(r"hydrogeological|aquifer|groundwater flow|subsurface water", user_input):
            return self.responses["hydrogeological_scenario"]()
        elif re.search(r"water quality|quality of water|contaminants|pollution levels", user_input):
            return self.responses["water_quality"]()
        elif re.search(r"available reports|reports for area|hydrological reports|groundwater assessment", user_input):
            return self.responses["available_reports"]()
        elif re.search(r"generate report|comprehensive report|report|groundwater report|hydrological study", user_input):
            return self.responses["generate_report"]()
        elif re.search(r"noc conditions|conditions for noc|noc condition|permission for groundwater use", user_input):
            return self.responses["noc_conditions"]()
        elif re.search(r"how to obtain noc|guidance for noc|noc guidance|noc application process", user_input):
            return self.responses["noc_guidance"]()
        elif re.search(r"groundwater terms|definitions|ground water terms|hydrological glossary", user_input):
            return self.responses["groundwater_terms"]()
        elif re.search(r"training opportunities|workshops|courses on groundwater|hydrology training", user_input):
            return self.responses["training_opportunities"]()
        elif re.search(r"recharge methods|rainwater harvesting|artificial recharge", user_input):
            return "Artificial recharge methods include rainwater harvesting, percolation tanks, and recharge wells to enhance groundwater levels."
        elif re.search(r"groundwater conservation|sustainable water use|water management", user_input):
            return "Groundwater conservation strategies involve controlled extraction, rainwater harvesting, and policies to regulate overuse."
        else:
            return self.responses["default"]()

# Chatbot Interaction
def chat():
    chatbot = VoiceDriftChatbot()
    print("Hii! Welcome to the VoiceDrift AI Chatbot!<br />I am Delta, your AI-powered Virtual Assistant. How can I assist you today?<br />You can ask me about water levels, hydrogeological scenarios, water quality, available reports, NOC conditions, NOC Guidance, Ground Water terms, Ground Water Report.")

    while True:
        user_input = input("Enter here: ")
        if user_input.lower() in Goodbye_list:
            print("No problem. Is there anything else I can assist you with?")
            follow_up = input("Enter here: ")
            if follow_up.lower() in Deny_list:
                print("Goodbye! Have a nice day.")
                break
            elif follow_up.lower() in Affirm_list:
                print("You can ask me about water levels, hydrogeological scenarios, water quality, available reports, NOC conditions, NOC Guidance, Ground Water terms, Ground Water Report.")
                continue
        elif user_input.lower() in Greeting_list:
            print("Hi! I am Delta, your AI-powered Virtual Assistant. How can I assist you today?")
            continue
        elif user_input.lower() in Repeat_list:
            print("You can ask me about water levels, hydrogeological scenarios, water quality, available reports, NOC conditions, NOC Guidance, Ground Water terms, Ground Water Report.")
            continue
        response = chatbot.get_response(user_input)
        print(f"{response}")

# Run the chatbot in Google Colab
if __name__ == "__main__":
    chat()
