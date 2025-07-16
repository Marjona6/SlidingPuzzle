import React from "react";
import { View, Image, StyleSheet, Dimensions } from "react-native";
import { ImageTile as ImageTileType } from "../utils/imageUtils";
import { theme } from "../config/theme";

interface ImageTileProps {
  tile: ImageTileType;
  tileSize: number;
  boardSize: number;
  levelSize: number;
  isMovable?: boolean;
  onPress?: () => void;
}

const ImageTileComponent: React.FC<ImageTileProps> = ({ tile, tileSize, boardSize, levelSize, isMovable = false, onPress }) => {
  if (tile.isBlank) {
    return (
      <View
        style={[
          styles.tile,
          {
            width: tileSize,
            height: tileSize,
          },
          styles.blankTile,
        ]}
      />
    );
  }

  // Calculate the position of this tile's portion in the original image
  // Use the tile's original position (originalRow, originalCol) to show the correct image portion
  const originalImageSize = 800;
  const imageTileSize = originalImageSize / levelSize;

  // Use the tile's original position in the image, not its current value
  const imageX = -tile.originalCol * imageTileSize;
  const imageY = -tile.originalRow * imageTileSize;

  console.log(`Tile ${tile.value}: originalRow=${tile.originalRow}, originalCol=${tile.originalCol}, imageX=${imageX}, imageY=${imageY}`);

  return (
    <View
      style={[
        styles.tile,
        {
          width: tileSize,
          height: tileSize,
        },
        isMovable && styles.movableTile,
      ]}
    >
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: tile.imageUrl.split("?")[0] }} // Remove query params for actual image URL
          style={[
            styles.tileImage,
            {
              width: originalImageSize,
              height: originalImageSize,
              left: imageX,
              top: imageY,
            },
          ]}
          resizeMode="cover"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  tile: {
    backgroundColor: theme.colors.tileBackground,
    borderRadius: theme.borderRadius.md,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    ...theme.shadows.small,
  },
  blankTile: {
    backgroundColor: theme.colors.tileBackgroundBlank,
    shadowOpacity: 0,
    elevation: 0,
  },
  movableTile: {
    backgroundColor: theme.colors.tileBackgroundMovable,
  },
  imageContainer: {
    width: "100%",
    height: "100%",
    overflow: "hidden",
    borderRadius: theme.borderRadius.md,
  },
  tileImage: {
    position: "absolute",
  },
});

export default ImageTileComponent;
