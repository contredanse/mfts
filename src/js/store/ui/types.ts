export type UILangCode = string;

// Use const enums for better autocompletion of action type names. These will
// be compiled away leaving only the final value in your compiled code.
//
// Define however naming conventions you'd like for your action types, but
// personally, I use the `@@context/ACTION_TYPE` convention, to follow the convention
// of Redux's `@@INIT` action.
export const enum UiActionTypes {
    SET_LANG = '@@ui/SET_UI_LANG',
    SET_IN_FULLSCREEN = '@@ui/SET_IN_FULLSCREEN',
    SET_IS_MENU_OPEN = '@@ui/SET_IS_MENU_OPEN',
    SET_CONTROLBAR_HIDDEN = '@@ui/SET_CONTROLBAR_HIDDEN',
}

export interface UiState {
    readonly lang: UILangCode;
    readonly fullscreen: boolean;
    readonly isMenuOpen: boolean;
    readonly isControlbarHidden: boolean;
}
