import React, { useEffect } from 'react';
import { View, Text, Animated, Easing, StyleSheet } from 'react-native';

const BatAndBallAnimation = () => {
  const ballAnim = new Animated.Value(0); // Ball's horizontal position
  const batAnim = new Animated.Value(0); // Bat's rotation (swing)

  useEffect(() => {
    // Trigger the animation when the component mounts
    Animated.sequence([
      // Bat swing animation
      Animated.timing(batAnim, {
        toValue: 45, // Rotate bat 45 degrees to simulate a swing
        duration: 300,
        easing: Easing.ease,
        useNativeDriver: true,
      }),
      // Ball movement after hitting
      Animated.timing(ballAnim, {
        toValue: 200, // Move the ball horizontally (rightward) after the hit
        duration: 500,
        easing: Easing.bounce,
        useNativeDriver: true,
      }),
      // Return the bat to its original position after swing
      Animated.timing(batAnim, {
        toValue: 0,
        duration: 100,
        easing: Easing.ease,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <View style={styles.container}>
      {/* Animated Bat */}
      <Animated.View
        style={[
          styles.bat,
          {
            transform: [{ rotateZ: batAnim.interpolate({ inputRange: [0, 45], outputRange: ['0deg', '45deg'] }) }],
          },
        ]}
      >
        <View style={styles.batInner}></View>
      </Animated.View>

      {/* Animated Ball */}
      <Animated.View
        style={[
          styles.ball,
          {
            transform: [{ translateX: ballAnim }], // Move the ball to the right
          },
        ]}
      >
        <View style={styles.ballInner}></View>
      </Animated.View>

      {/* Label or App Name */}
      {/* <Text style={styles.appName}>Game Loop</Text> */}
      <Text style={{ fontSize: 34, fontWeight: 'bold', textAlign: 'center' }}>GameLoop</Text>
        <Text style={{ textAlign: 'center', fontSize: 16, color: '#666' }}>Live Updates on Football & Baseball</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  appName: {
    fontSize: 30,
    fontWeight: 'bold',
    marginTop: 20,
  },
  bat: {
    position: 'absolute',
    bottom: 150,
    left: 50,
    width: 100,
    height: 20,
    backgroundColor: '#2c3e50',
    borderRadius: 10,
  },
  batInner: {
    flex: 1,
    backgroundColor: '#e74c3c',
  },
  ball: {
    position: 'absolute',
    bottom: 160,
    left: 160,
    width: 30,
    height: 30,
    backgroundColor: '#f39c12',
    borderRadius: 15,
  },
  ballInner: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 15,
  },
});

export default BatAndBallAnimation;
