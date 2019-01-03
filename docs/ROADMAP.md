# Roadmap 

- [X] Video cleanup
  - [X] MP4/WebM done ! (deint...)

- [X] Language support 
  - [X] Persist choice in localStorage
  - [X] Integration with redux
  - [X] Integration with redux and route
  - [X] Translations (react-i18n-next)

- [X] General application
  - [X] Fullscreen
  
- [x] Video player
  - [x] Sound buttons (on/off)
  - [x] Loading indicator (currently a message)
    - [x] Loading indicator as a message
    - [x] `NiceToHave` Add loading animation 
  - [x] Menu for playback speed
    - [x] `NicetoHave` auto mute sound if speed below or over limits.
  - [x] OnEnd event, when video finish let's go `somewhere`
  - [x] Persist choice for subtitles (local storage)
  
       
- [x] Page behaviours  
  - [x] When playback very short - loop ? Question  
  - [x] Playback next/previous video 
  - [x] Control play/pause with space
  - [x] Multi video player
        - [x] Video zoom 

- [ ] Page list:
  - [ ] Organize by section
  - [x] Accept menuId filter
  - [x] Filter by menuId
  - [ ] Filter by sections

- [X] Menu
  - [X] Menu with links to helix, search, about, login...
  - [X] Helix **see with @emeric**.
      
- [x] Data
  - [X] Repository: get the next/previous page from MenuRepository
     

- [X] Authentication
  - [X] Login form
  - [x] Backend ? (symfony/zend-expressive ?)
    - [x] Contredanse_v4 support

  
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
    - [x] Design: Broaden click to entire text block -> goto intro  
    - [x] Design: language to right upper corner  
    - [x] Design: Video background (2tubes)
    - [x] Feature: Remove speed behaviour onMouseOver
  - [x] **Introduction page**
    - [x] Skip intro -> go to navigation (helix or page list / quid mobile ?)    
  - [x] **Navigation Appbar**
    - [x] Design: Page breadcrumb should be in the top area.
    - [x] Design: Keep only hamburger menu and helix icons
    - [x] Feature: Side navigation opens submenu (contredanse provides markdown)    
       - [x] Home
       - [x] About 
       - [x] Content
       - [x] Credits 
       - [x] Biography
       - [x] (Login/Logout)
       - [x] Language and Link contredanse 
       - [x] CopDeployment

  - [x] **Page**
    - [x] Design: margin-bottom to prevent video to overlap with controls
  - [x] **PageList**
      - [x] Design: Move the search to the top (new appbar)    
  - [x] **Player**       
    - [x] Overlay:
      - [x] Strategy choice (next / reload / timeout ?)       
    - [x] Controlbar
      - [x] Playback speed control 
        - [x] If video is muted or explicit definition `speed_control` in data.
      - [x] Translated tooltips for buttons (play, pause, show subtitles...)              
      - [x] SVG icons:
        - [ ] <u>Contredanse</u>
          - [ ] play/pause maybe ? 
          - [ ] looping on/off variants
          - [ ] subtitles on/off variants
      - [x] Change orger of icons
          - [x] Previous to the left... (greyed if not availble)         
  - [x] **Static pages**
    - [x] Markdown for pages
      - [x] Bibliography
      - [x] Copyright
      - [x] Credits
      - [x] Biography
      - [x] Biblio
               
