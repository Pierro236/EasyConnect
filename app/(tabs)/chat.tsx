import { StyleSheet } from "react-native";

import EditScreenInfo from "../../components/EditScreenInfo";
import { Text, View } from "../../components/Themed";
import { useEffect, useState } from "react";
import OpenAI from "openai";

export default function TabTwoScreen() {
  const [text, setText] = useState("");
  useEffect(() => {
    console.log("TabTwoScreen");
    const openai = new OpenAI({
      apiKey: "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",
    });

    async function main() {
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You are a helpful assistant." },
          { role: "user", content: "Who won the world series in 2020?" },
          {
            role: "assistant",
            content: "The Los Angeles Dodgers won the World Series in 2020.",
          },
          { role: "user", content: "Where was it played?" },
        ],
      });

      setText(response.choices[0].message.content || "");
    }

    main();
  }, []);
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{text}</Text>
      <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />
      <EditScreenInfo path="app/(tabs)/two.tsx" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});
