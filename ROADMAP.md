# TODO

- [X] Video cleanup
  - [X] MP4/WebM done ! (deint...)

- [X] Language support 
  - [X] Persist choice in localStorage
  - [X] Integration with redux
  - [X] Integration with redux and route
  - [X] Translations (react-i18n-next)
  
- [ ] Video player
  - [x] Sound buttons (on/off)
  - [x] Loading indicator (currently a message)
    - [x] Loading indicator as a message
    - [x] `NiceToHave` Add loading animation 
  - [ ] Menu for playback speed
    - [ ] `NicetoHave` auto mute sound if speed below or over limits.
  - [x] OnEnd event, when video finish let's go `somewhere`
  - [x] Persist choice for subtitles (local storage)
  - [ ] NTH: Volume slider
  
       
- [ ] Page behaviours  
  - [ ] When playback very short - loop ? Question  
  - [x] Playback next/previous video 
  - [ ] Control play/pause with space
  - [ ] Multi video player
        - [ ] Video zoom 
        - [ ] NiceToHave (play - image par image)

- [ ] Page list:
  - [ ] Organize by section
  - [x] Accept menuId filter
  - [x] Filter by menuId

- [X] Menu
  - [X] Menu with links to helix, search, about, login...
  - [ ] Helix **see with @emeric**.
      
- [x] Data
  - [X] Repository: get the next/previous page from MenuRepository
     

- [ ] Authentication
  - [ ] Profile page (wip)
    - [X] Login form
    - [ ] Register form
    - [ ] Info (pricing) ?
  - [ ] Backend ? (symfony/zend-expressive ?)
    - [ ] Contredanse_v4 support

- [x] Credits
- [ ] Biography
- [ ] Biblio
  
- [x] Meta manager (title)
  - [x] Home made document meta component  




------


- Validation
  - [x] Homepage
    - [ ] Language selection (position) 
    - [ ] BOX avec onhover et petite main
    - [ ] Video background (2tubes)
    - [ ] Enlever selecteur vitesse
      
  - [ ] Menu
    - [ ] When displayed, only hamburger/helix
    - [ ] Home/About/Content/Credits/Biography/(Login/Logout)/Language/Link contredanse
  - [ ] Introduction page
    - [ ] Skip intro -> go to navigation (helix ?)
  - [ ] Player       
    - [ ] Overlay:
      - [ ] Strategy choice
      - [ ] Margin-bottom ahuteur de la controlbar. (verif audio) 
    - [ ]  
    - [x] Playback speed (only when possible)
    - [x] Looping
      - [ ] Create an attribute in `data-pages/.json`
      - [ ] 
    - [ ] Controlbar
      - [ ] Icons: loop + yes bouton loop
      - [ ] Previous gauche... (affiche en grisé)         
      - [ ] 2 svg ... icônes différentes pour sous-titre (on/off)
         
