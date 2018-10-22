export type UILangCode = string;

// Use const enums for better autocompletion of action type names. These will
// be compiled away leaving only the final value in your compiled code.
//
// Define however naming conventions you'd like for your action types, but
// personally, I use the `@@context/ACTION_TYPE` convention, to follow the convention
// of Redux's `@@INIT` action.
export const enum LangActionTypes {
    SET_UI_LANG = '@@lang/SET_UI_LANG',
}

export interface UiState {
    readonly lang: UILangCode;
}
