from dsl import *
set_class("shared", [1, 2, 3, 4], [1, 2, 3, 4])
card("swap", "Swap", 1, "K", "adjacent_ally", [SWAP()], "Trade places with an adjacent hero.", art="swap")
card("dread", "Dread", 0, "Curse", "none", [], "Unplayable. When drawn: lose 1 vigour and draw a replacement.", use=[], art="dread", kw=["Curse"])
card("festering", "Festering Wound", 0, "Curse", "none", [], "Unplayable. When drawn: lose 2 HP and draw a replacement. Cured at the infirmary.", use=[], art="festering", kw=["Curse"])
