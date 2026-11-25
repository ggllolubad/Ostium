"""The road through the doors: the fixed story order of the fifteen worlds.

Each world shares one element with the world before it. Clearing a world unseals only the next door on the road.
Once all fifteen are cleared, every door stays open and the company may Cast Lots for a random door.
`lead` is the clue that sends the company to that world, shown on its door and when it unseals.
Imported by bestiary.py, which merges story fields into data/worlds.json and writes data/story.json.
"""

ACTS = [
    {"n": 1, "name": "The Waters Below", "worlds": ["drowned", "mire", "baths"]},
    {"n": 2, "name": "The Fires Beneath", "worlds": ["pits", "foundry", "coast"]},
    {"n": 3, "name": "The Long Cold", "worlds": ["fleet", "rime", "barrow"]},
    {"n": 4, "name": "The Stilling", "worlds": ["hive", "spire", "silence"]},
    {"n": 5, "name": "The Hollow Heaven", "worlds": ["pyre", "garden", "sky"]},
]

LEADS = {
    "drowned": "Water seeps under the first door, and bells ring in the crypt at night. The Prior sends the first company down.",
    "mire": "The Drowned King's crown is packed with fen peat. The tide that took his kingdom still runs inland, to a poison fen.",
    "baths": "The fen hags sold their black mud to a temple of baths as a cure. The Mire Mother's head is still warm. Something upstream is boiling.",
    "pits": "The baths were never heated with wood. Their furnaces burned brimstone, carted up from the pits below.",
    "foundry": "Every powder cart went to one buyer: a foundry in the clouds. The Canary Priests sang its name to the gas.",
    "coast": "The foundry cast bells for the sea-kingdoms. Its storm broke loose and drifted out over the coast, and it has not stopped since.",
    "fleet": "The wreckers' ledger lists every ship they took, and the one fleet they let pass: a war fleet sailing north to kill a leviathan.",
    "rime": "The fleet's charts end at a white sea and a glacier with fire beneath it. The leviathan was fleeing that heat.",
    "barrow": "The Jarl's hold buried its plague dead in barrows beyond the ice. The Riven Jarl wore a barrow-lord's ring.",
    "hive": "The Barrow King's plague came up the trade road from the south, inside a traveller who moved when the larvae did.",
    "spire": "Pilgrims crossed the hive plain to an observatory, to watch the stars stop. Some of them are still walking.",
    "silence": "The Last Hour's hand points at one star: the one the astronomers stopped time to keep from falling. It fell.",
    "pyre": "The Frozen Saints died praying toward a black flame. They were pilgrims, fleeing a cathedral where saints were burned.",
    "garden": "The Saint Unending was burned for one sermon: that heaven was a garden, and a woman kept it. Her ash still drifts toward it.",
    "sky": "Every eye in the garden looks up. The Antlered Mother's roots grow toward a tear in the sky.",
}

FINALE = "The Shattered God has every part but one. The mouth is in the abbey, behind the high altar."

ORDER = [w for a in ACTS for w in a["worlds"]]
assert len(ORDER) == 15 and len(set(ORDER)) == 15
assert set(LEADS) == set(ORDER)


def apply(worlds):
    """Adds story index, act and lead to each world, checks the shared-element chain, returns story.json content."""
    for i, k in enumerate(ORDER):
        act = next(a for a in ACTS if k in a["worlds"])
        worlds[k]["story"] = i
        worlds[k]["act"] = act["n"]
        worlds[k]["act_name"] = act["name"]
        worlds[k]["lead"] = LEADS[k]
        if i > 0:
            prev = worlds[ORDER[i - 1]]["pair"]
            assert set(prev) & set(worlds[k]["pair"]), ("road breaks between", ORDER[i - 1], k)
    return {"order": ORDER, "acts": ACTS, "finale": FINALE}
