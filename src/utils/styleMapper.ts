import { ViewStyle, TextStyle, ImageStyle } from 'react-native';

export const mapJsonToStyles = (node: any): ViewStyle | TextStyle | ImageStyle => {
    const style: any = {};

    if (!node || !node.properties) return style;

    const { position, size, styles, layout, font } = node.properties;

    if (size) {
        style.width = size.width;
        style.height = size.height;
    }

    // Auto layout -> Flexbox mapping
    if (layout) {
        if (layout.direction === 'HORIZONTAL') {
            style.flexDirection = 'row';
        } else if (layout.direction === 'VERTICAL') {
            style.flexDirection = 'column';
        }

        if (layout.itemSpacing) {
            style.gap = layout.itemSpacing;
        }
        if (layout.padding) {
            style.paddingTop = layout.padding.top ?? 0;
            style.paddingBottom = layout.padding.bottom ?? 0;
            style.paddingLeft = layout.padding.left ?? 0;
            style.paddingRight = layout.padding.right ?? 0;
        }

        if (layout.primaryAxisAlignItems === 'CENTER') {
            style.justifyContent = 'center';
        } else if (layout.primaryAxisAlignItems === 'MAX') {
            style.justifyContent = 'flex-end';
        } else if (layout.primaryAxisAlignItems === 'SPACE_BETWEEN') {
            style.justifyContent = 'space-between';
        }

        if (layout.counterAxisAlignItems === 'CENTER') {
            style.alignItems = 'center';
        } else if (layout.counterAxisAlignItems === 'MAX') {
            style.alignItems = 'flex-end';
        }
    }

    // Fills and Strokes
    if (styles) {
        if (styles.fills && styles.fills.length > 0) {
            const solidFill = styles.fills.find((f: any) => f.type === 'SOLID');
            if (solidFill && solidFill.color) {
                const { r, g, b, a } = solidFill.color;
                style.backgroundColor = `rgba(${r}, ${g}, ${b}, ${a ?? 1})`;
            }
        }
        if (styles.strokes && styles.strokes.length > 0) {
            const stroke = styles.strokes[0];
            if (stroke.color) {
                const { r, g, b, a } = stroke.color;
                style.borderColor = `rgba(${r}, ${g}, ${b}, ${stroke.opacity ?? a ?? 1})`;
                style.borderWidth = 1;
            }
        }
        // Handle border radius if available
        if (node.properties.cornerRadius) {
            style.borderRadius = node.properties.cornerRadius;
        }
    }

    // Typography
    if (node.type === 'TEXT' && font) {
        style.fontFamily = font.family;
        style.fontSize = font.size;
        if (font.style === 'SemiBold') style.fontWeight = '600';
        else if (font.style === 'Medium') style.fontWeight = '500';
        else if (font.style === 'Bold') style.fontWeight = '700';

        if (styles?.fills && styles.fills.length > 0) {
            const solidFill = styles.fills.find((f: any) => f.type === 'SOLID');
            if (solidFill && solidFill.color) {
                const { r, g, b, a } = solidFill.color;
                style.color = `rgba(${r}, ${g}, ${b}, ${a ?? 1})`;
                delete style.backgroundColor; // Ensure text fill translates to color, not bg
            }
        }
    }

    return style;
};
