import spacy

class EntityTagger:
    def __init__(self):
        # Load english model
        self.nlp = spacy.load("en_core_web_sm")

    def process_text(self, text):
        """
        Using spacy process a given paragraph and extract named entities.
        Spacy will perform the tokenization as well as the manual tagging which
        are the first steps of the research paper logic to implement CRF Model training

        Arguments:
        - text (str): input string that spacy will tokenize and tag.

        Returns:
        - A map of [Entity : list of mentions].
        """
        doc = self.nlp(text)

        # only want to store PERSON, ORG, LOC, OTHER, so create a map with entity : [ent.text]
        valid_entities = {"PERSON" : [], "ORG" : [], "LOC" : [], "OTHER" : []}

        for ent in doc.ents:
            if ent.label_ == "PERSON":
                valid_entities["PERSON"].append(ent.text)
            elif ent.label_ == "ORG":
                valid_entities["ORG"].append(ent.text)
            elif ent.label_ == "LOC" or ent.label_ == "GPE":
                valid_entities["LOC"].append(ent.text)
            else:
                valid_entities["OTHER"].append(ent.text)

        return valid_entities

if __name__ == "__main__":
    entity_tagger = EntityTagger()

    sample_text = (
        "In the bustling city of Arcadia, John(B-PERSON) Smith(PERSON), a renowned scientist, was conducting "
        "groundbreaking research at Quantum Dynamics, a cutting-edge organization focused on "
        "pushing the boundaries of science and technology. Meanwhile, Sarah Williams, a talented "
        "artist, was preparing for her upcoming exhibition at the Artisan Gallery. The city's "
        "central park, Serenity Park, was abuzz with activity as people from various walks of life "
        "gathered for a charity event organized by the Hope Foundation, a nonprofit organization "
        "dedicated to improving the lives of underprivileged children. As the sun set over the "
        "cityscape, a mysterious figure known only as The Phantom lurked in the shadows, leaving "
        "behind cryptic messages that puzzled both law enforcement and citizens alike."
    )

    extracted_entities = entity_tagger.process_text(sample_text)

    for category, entities in extracted_entities.items():
        print(f"{category}: {entities}")

        "Apple is a big corporation"
        "Apple-BOrg"

