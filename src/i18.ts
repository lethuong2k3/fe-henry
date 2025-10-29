import i18n from 'i18next'

import { initReactI18next } from 'react-i18next'
import en from './locales/en.json'
import vn from './locales/vn.json'

i18n.use(initReactI18next).init({
    resources: {
        en: {
            translation: en
        },
        vi: {
            translation: vn
        }
    },
    lng: "vi", // default language
    fallbackLng: "vi"
})

export default i18n