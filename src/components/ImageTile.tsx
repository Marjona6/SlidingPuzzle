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

  const imageUrl = tile.imageUrl.replace("?w=800&h=800&fit=crop", "?w=600&h=600&fit=crop&q=80");

  // For rectangular grids, we need to calculate the full image size based on the levelSize
  // and then position the image correctly for each tile
  const fullImageSize = tileSize * levelSize;
  const offsetX = -tile.originalCol * tileSize;
  const offsetY = -tile.originalRow * tileSize;

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
          source={{ uri: imageUrl }}
          style={[
            styles.tileImage,
            {
              width: fullImageSize,
              height: fullImageSize,
              left: offsetX,
              top: offsetY,
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
    // Removed overflow: "hidden" to test if that's the issue
    borderRadius: theme.borderRadius.md,
  },
  tileImage: {
    position: "absolute",
  },
});

export default ImageTileComponent;
