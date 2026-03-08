import React, { useState } from 'react';
import { Image, ImageProps, View, Text } from 'react-native';

interface SafeImageProps extends ImageProps {
    fallbackUri?: string;
    fallbackText?: string;
}

export const SafeImage = (props: SafeImageProps) => {
    const { source, fallbackUri, fallbackText, style, ...rest } = props;
    const [hasError, setHasError] = useState(false);

    const defaultFallback = fallbackUri || `https://ui-avatars.com/api/?name=${encodeURIComponent(fallbackText || 'Music')}&background=random`;

    if (hasError || !source) {
        return (
            <Image
                source={{ uri: defaultFallback }}
                style={style}
                {...rest}
            />
        );
    }

    return (
        <Image
            source={source}
            style={style}
            onError={() => setHasError(true)}
            {...rest}
        />
    );
};
