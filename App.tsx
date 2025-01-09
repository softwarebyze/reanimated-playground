// @refresh reset
import { useEffect } from "react";
import { ScrollView, StyleProp, TextStyle } from "react-native";
import Animated, {
  AnimatedStyle,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSpring,
} from "react-native-reanimated";

function Container({ children }: { children: React.ReactNode }) {
  return (
    <ScrollView
      contentContainerStyle={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {children}
    </ScrollView>
  );
}

export default function ReanimatedPlayground() {
  return (
    <Container>
      <SplitMovingText text="Everybody can cook" />
    </Container>
  );
}

function AnimatedLetter({ text, index }: { text: string; index: number }) {
  const fromY = 1;
  const toY = 0;
  const y = useSharedValue(fromY);

  const fromOpacity = 1;
  const toOpacity = 0;
  const opacity = useSharedValue(fromOpacity);

  const duration = 1000;

  const topAnimatedStyles = useAnimatedStyle(() => ({
    fontSize: 24,
    opacity: opacity.value,
    transform: [{ scaleY: y.value }],
  }));

  useEffect(() => {
    const reverse = false;
    y.value = withDelay(
      index * 100,
      withRepeat(withSpring(toY, { duration }), -1, reverse)
    );
    opacity.value = withDelay(
      index * 100,
      withRepeat(withSpring(toOpacity, { duration }), -1, reverse)
    );
  }, []);

  const fromBottomY = 20;
  const toBottomY = 0;
  const bottomY = useSharedValue(fromBottomY);

  const fromBottomScale = 0;
  const toBottomScale = 1;
  const bottomScale = useSharedValue(fromBottomScale);

  const bottomAnimatedStyles = useAnimatedStyle(() => ({
    fontSize: 24,
    position: "absolute",
    transform: [{ scaleY: bottomScale.value }],
  }));

  const topStyle: StyleProp<AnimatedStyle<StyleProp<TextStyle>>> = {
    transformOrigin: "top",
  };
  const bottomStyle: StyleProp<AnimatedStyle<StyleProp<TextStyle>>> = {
    transformOrigin: "bottom",
  };

  useEffect(() => {
    const reverse = false;
    bottomY.value = withDelay(
      index * 100,
      withRepeat(withSpring(toBottomY, { duration }), -1, reverse)
    );
    bottomScale.value = withDelay(
      index * 100,
      withRepeat(withSpring(toBottomScale, { duration }), -1, reverse)
    );
  }, []);

  return (
    <Animated.View>
      <Animated.Text style={[topStyle, topAnimatedStyles]}>
        {text}
      </Animated.Text>
      <Animated.Text style={[bottomStyle, bottomAnimatedStyles]}>
        {text}
      </Animated.Text>
    </Animated.View>
  );
}

function SplitMovingText({ text = "hello" }: { text?: string }) {
  return (
    <Animated.View style={{ flexDirection: "row" }}>
      {text.split("").map((char, i) => (
        <AnimatedLetter key={i} text={char} index={i} />
      ))}
    </Animated.View>
  );
}
