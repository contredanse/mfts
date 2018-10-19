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

# Meeting notes

- TODO list
  - [x] **Data `data-pages.json`**
      - [x] New attribute: `loop` to control infinite loops
      - [x] New attribute: `loop_number` to control number of iterations
      - [x] New attribute: `speed_control` to display video speed control
  - [x] **Homepage/Landing page**
    - [x] Language selection (position up right corner) 
    - [x] BOX avec onhover et petite main
    - [x] Video background (2tubes)
    - [x] Remove speed behaviour onMouseOver
  - [x] **Introduction page**
    - [ ] Skip intro -> go to navigation (helix or page list / quid mobile ?)    
  - [ ] **Navigation Appbar**
    - [ ] Page breadcrumb should be in the top area.
    - [ ] Keep only hamburger menu and helix icons
    - [ ] Side navigation opens submenu (contredanse provides markdown)    
       - [ ] Home
       - [ ] About 
       - [ ] Content
       - [ ] Credits 
       - [ ] Biography
       - [ ] (Login/Logout)
       - [ ] Language and Link contredanse        
  - [ ] **Page**
    - [x] For single page, make a margin-bottom of 60px of the video
  - [ ] **PageList**
      - [ ] Move the search to the top    
  - [x] **Player**       
    - [x] Overlay:
      - [ ] Strategy choice (next / reload / timeout ?)       
    - [ ] Controlbar
      - [x] Playback speed control 
        - [x] If video is muted or explicit definition `speed_control` in data.
      - [ ] Translated tooltips for buttons (play, pause, show subtitles...)              
      - [ ] SVG icons:
        - [ ] <u>Contredanse</u>
          - [ ] play/pause maybe ? 
          - [ ] looping on/off variants
          - [ ] subtitles on/off variants
      - [ ] Visually indicate that it's autoloop or looping iterations
      - [ ] Change orger of icons
          - [ ] Previous to the left... (greyed if not availble)         
  - [x] **Static pages**
    - [ ] Markdown for pages
      - [ ] Bibliography
               
