export interface ThemeConfig {
    breakpoints: {
        mobile: number
        tablet: number
        desktop: number
    }
}

export const defaultThemeConfig: ThemeConfig = {
    breakpoints: {
        mobile: 768,
        tablet: 1024,
        desktop: 1200
    }
};