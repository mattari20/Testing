# M2888–M2967 — Editor Preview Pipeline

Connected the live editor runtime to the existing preview engine. The pipeline creates a preview request from current projection/layout state and delegates pagination/render-result semantics to the existing preview contract. Template acquisition is injected, keeping template storage and browser rendering separate.