// @refresh reset
import { useEffect } from "react";
import { ScrollView } from "react-native";
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
    <ScrollView contentContainerStyle={styles.container}>{children}</ScrollView>
  );
}

const AnimatedLetter = ({ text, index }: { text: string; index: number }) => {
  const duration = 1100;
  const delayMultiplier = 75;

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

    y.value = withDelay(delay, withRepeat(withSpring(0, { duration }), 1));

    opacity.value = withDelay(
      delay,
      withRepeat(withSpring(0, { duration }), 1)
    );

    bottomScale.value = withDelay(
      delay,
      withRepeat(withSpring(1, { duration, overshootClamping: true }), 1)
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
  <Animated.View style={{ flexDirection: "row" }}>
    {text.split("").map((char, i) => (
      <AnimatedLetter key={i} text={char} index={i} />
    ))}
  </Animated.View>
);

const styles = {
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  topStyle: {
    transformOrigin: "top",
  },
  bottomStyle: {
    transformOrigin: "bottom",
  },
  sharedStyle: {
    fontSize: 40,
  },
} as const;
