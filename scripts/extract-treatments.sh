#!/bin/bash
# Extract all treatment types from the autism guide

echo "Extracting treatments from PDF..."

# Extract Table 1 (Evidence-Based) treatments
grep -A 1 "^[A-Z][a-zA-Z ]*Therapy" /home/ubuntu/clawd/projects/autism-hub/data/autism-guide.txt | head -50

# Extract intervention names (lines that are likely treatment names)
grep -E "^(DTT|ABA|ESDM|Speech|Occupational|Physical|OT|PT|SLT|AAC|PECS)" /home/ubuntu/clawd/projects/autism-hub/data/autism-guide.txt | head -20

echo "
Search keywords to add:
- Discrete Trial Training
- ESDM (Early Start Denver Model)
- Pivotal Response Treatment (PRT)
- Project ImPACT
- Speech-Language Therapy (SLT)
- PROMPT therapy
- DTTC (Dynamic Temporal and Tactile Cueing)
- AAC (Augmentative and Alternative Communication)
- PECS
- DIR/Floortime
- Parent-Child Interaction Therapy (PCIT)
- Hanen Programs
- Social Skills Groups
- Feeding therapy (SOS approach)
- ARFID treatment
- Risperidone
- Aripiprazole
"
