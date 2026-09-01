import { Modal, Pressable, StyleSheet, Text, View } from "react-native";

export function MenuDrawer({
  onClose,
  onOpenSquad,
  visible,
}: {
  onClose: () => void;
  onOpenSquad: () => void;
  visible: boolean;
}) {
  return (
    <Modal
      animationType="fade"
      onRequestClose={onClose}
      transparent
      visible={visible}
    >
      <View style={styles.overlay}>
        <Pressable
          accessibilityLabel="Close menu"
          onPress={onClose}
          style={styles.backdrop}
        />
        <View style={styles.drawer}>
          <View style={styles.header}>
            <Text style={styles.title}>Menu</Text>
            <Pressable
              accessibilityLabel="Close menu"
              onPress={onClose}
              style={styles.close}
            >
              <Text style={styles.closeText}>x</Text>
            </Pressable>
          </View>
          <Pressable onPress={onOpenSquad} style={styles.item}>
            <View style={styles.icon}>
              <Text style={styles.iconText}>S</Text>
            </View>
            <View>
              <Text style={styles.itemTitle}>Squad</Text>
              <Text style={styles.itemHint}>
                Names and match-day availability
              </Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: StyleSheet.absoluteFillObject,
  chevron: { color: "#687365", fontSize: 25, marginLeft: "auto" },
  close: {
    alignItems: "center",
    backgroundColor: "#173a2a",
    borderRadius: 4,
    height: 36,
    justifyContent: "center",
    width: 36,
  },
  closeText: { color: "#f4efe3", fontSize: 19, fontWeight: "700" },
  drawer: {
    backgroundColor: "#f4efe3",
    borderRightColor: "#d9d1c1",
    borderRightWidth: 1,
    gap: 24,
    minHeight: "100%",
    padding: 24,
    paddingTop: 58,
    width: "84%",
  },
  header: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  icon: {
    alignItems: "center",
    backgroundColor: "#f06a2f",
    borderRadius: 4,
    height: 42,
    justifyContent: "center",
    width: 42,
  },
  iconText: { color: "#ffffff", fontSize: 17, fontWeight: "800" },
  item: {
    alignItems: "center",
    backgroundColor: "#fbf8f1",
    borderColor: "#d9d1c1",
    borderRadius: 5,
    borderWidth: 1,
    flexDirection: "row",
    gap: 12,
    padding: 14,
  },
  itemHint: { color: "#687365", fontSize: 12, marginTop: 2 },
  itemTitle: { color: "#173a2a", fontSize: 16, fontWeight: "800" },
  overlay: { backgroundColor: "rgba(23, 58, 42, 0.36)", flex: 1 },
  title: {
    color: "#173a2a",
    fontFamily: "Avenir Next Condensed",
    fontSize: 30,
    fontWeight: "800",
    letterSpacing: -0.7,
  },
});
