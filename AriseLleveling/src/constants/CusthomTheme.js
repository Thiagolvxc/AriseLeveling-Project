import {DefaultTheme} from "@react-navigation/native";
import colors from "./colors";

const CusthomTheme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        background: colors.variante6,
        backgroundSplashScreen: colors.variante4,
        card: colors.variante2,
        text: colors.default,
        
    }
}

export default CusthomTheme;