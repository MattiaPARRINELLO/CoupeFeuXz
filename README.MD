<font size="10">**Comment ajouter tes prods ?**</font>

1. Ajoute ta prod dans le dossier « Prod » (avec comme titre le titre de t’a prod avec les espaces + .mp3)
2. Ajoute ta prod avec tag dans le dossier « Prods-test » (avec comme titre le titre de t’a prod avec les espaces + .mp3)
3. Va dans le fichier Prods.json
4. Ajoute cette ligne 
```json
"x" : [
{"description" : "", "price" : "", "name" : ""}
]
```
5. A la place de X met le nombre dans une suite logique (1, 2, 3, 4, …)
6. Met la description de ta prod 
7. Le prix 
8. Le titre (doit correspondre exactement au nom du fichier)
9. Va dans le fichier Liste/index.html 
10. Ajoute cette ligne 
```html
<li><a href="more/?type=19">Prod 19</a></li>
```
11. Met le titre de ta prod à la place de Prod 19\*
12. Le chiffre après type= doit être le même que celui que tu as mis a la place de X dans l’étape 5
13. Retourne au fichier racine et va dans codes.json 
14. Ajoute une ligne comme ça :
```json
["", ""]
```
15. Ajoute les codes entre les crochets, sépare-les par des virgules
16. Dans le paragraphe d’en dessous, ajoute le titre simplement entre crochet

Si tu ne comprend pas quelque chose n’hésite pas a m’appeler

<font size="6">**Les virgules dans les fichiers json doivent être mises en fin de lignes si celle-ci n’est pas la dernière.**</font>
