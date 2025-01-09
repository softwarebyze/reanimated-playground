import { useEffect } from "react";
import { SafeAreaView, ScrollView, StyleSheet } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSpring,
} from "react-native-reanimated";

export default function ReanimatedPlayground() {
  return (
    <Container>
      <SplitMovingText text="Everybody can cook." />
    </Container>
  );
}

function Container({ children }: { children: React.ReactNode }) {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.container}>
        {children}
      </ScrollView>
    </SafeAreaView>
  );
}

const AnimatedLetter = ({ text, index }: { text: string; index: number }) => {
  const duration = 700;
  const delayMultiplier = 40;

  const y = useSharedValue(1);
  const opacity = useSharedValue(1);
  const bottomScale = useSharedValue(0);

  const topAnimatedStyles = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scaleY: y.value }],
  }));

  const bottomAnimatedStyles = useAnimatedStyle(() => ({
    position: "absolute",
    transform: [{ scaleY: bottomScale.value }],
  }));

  useEffect(() => {
    const delay = (index + 8) * delayMultiplier;
    const repeats = 1;

    y.value = withDelay(
      delay,
      withRepeat(withSpring(0, { duration }), repeats)
    );

    opacity.value = withDelay(
      delay,
      withRepeat(withSpring(0, { duration }), repeats)
    );

    bottomScale.value = withDelay(
      delay,
      withRepeat(withSpring(1, { duration, overshootClamping: true }), repeats)
    );
  }, [index]);

  return (
    <Animated.View>
      <Animated.Text
        style={[styles.sharedStyle, styles.topStyle, topAnimatedStyles]}
      >
        {text}
      </Animated.Text>
      <Animated.Text
        style={[styles.sharedStyle, styles.bottomStyle, bottomAnimatedStyles]}
      >
        {text}
      </Animated.Text>
    </Animated.View>
  );
};

const SplitMovingText = ({ text }: { text: string }) => (
  <Animated.View
    style={{ flexDirection: "row", width: "80%", flexWrap: "wrap" }}
  >
    {text.split("").map((char, i) => (
      <AnimatedLetter key={i} text={char} index={i} />
    ))}
  </Animated.View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "black",
  },
  topStyle: {
    transformOrigin: "top",
  },
  bottomStyle: {
    transformOrigin: "bottom",
  },
  sharedStyle: {
    fontSize: 48,
    color: "white",
    fontStyle: "italic",
  },
});
