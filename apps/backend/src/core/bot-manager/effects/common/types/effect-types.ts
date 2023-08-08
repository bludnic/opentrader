export const USE_SMART_TRADE = 'USE_SMART_TRADE'
export const REPLACE_SMART_TRADE = 'REPLACE_SMART_TRADE'
export const USE_DCA_DEAL = 'USE_DCA_DEAL'
export const USE_EXCHANGE = 'USE_EXCHANGE'

export type EffectType =
    typeof USE_SMART_TRADE |
    typeof REPLACE_SMART_TRADE |
    typeof USE_DCA_DEAL |
    typeof USE_EXCHANGE;
