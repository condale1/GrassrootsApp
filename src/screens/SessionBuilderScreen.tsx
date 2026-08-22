import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { drills, findDrill } from "../data/drills";
import { Drill, SessionDraft } from "../types";

type Props = { ageGroup: string; draft: SessionDraft; hasLoadedDraft: boolean; setDraft: React.Dispatch<React.SetStateAction<SessionDraft>> };
type DrillForm = { category: string; defaultMinutes: string; description: string; equipment: string; title: string };

const initialDrillForm: DrillForm = { title: "", category: "Coach's drill", defaultMinutes: "10", description: "", equipment: "" };

export function SessionBuilderScreen({ ageGroup, draft, hasLoadedDraft, setDraft }: Props) {
  const [drillForm, setDrillForm] = useState<DrillForm>(initialDrillForm);
  const library = [...drills, ...draft.customDrills];
  const total = draft.blocks.reduce((sum, block) => sum + block.minutes, 0);
  const changeMinutes = (id: string, amount: number) => setDraft((current) => ({ ...current, blocks: current.blocks.map((block) => block.id === id ? { ...block, minutes: Math.max(5, block.minutes + amount) } : block) }));
  const addDrill = (drillId: string) => {
    const drill = findDrill(drillId, library);
    setDraft((current) => ({ ...current, blocks: [...current.blocks, { id: `block-${Date.now()}`, drillId, minutes: drill.defaultMinutes }] }));
  };
  const addCustomDrill = () => {
    const title = drillForm.title.trim();
    if (!title) return;
    const customDrill: Drill = {
      id: `custom-${Date.now()}`,
      title,
      category: drillForm.category.trim() || "Coach's drill",
      defaultMinutes: Math.max(5, Number.parseInt(drillForm.defaultMinutes, 10) || 10),
      description: drillForm.description.trim() || "Add your own coaching notes for this drill.",
      equipment: drillForm.equipment.trim() || "Equipment to be confirmed"
    };
    setDraft((current) => ({ ...current, customDrills: [...current.customDrills, customDrill] }));
    setDrillForm(initialDrillForm);
  };
  const updateDrillForm = (field: keyof DrillForm, value: string) => setDrillForm((current) => ({ ...current, [field]: value }));

  return <View style={styles.container}>
    <View style={styles.sessionCard}>
      <TextInput accessibilityLabel="Session title" onChangeText={(title) => setDraft((current) => ({ ...current, title }))} placeholder="Session title" placeholderTextColor="#778173" style={styles.titleInput} value={draft.title} />
      <View style={styles.meta}><Text style={styles.metaText}>{ageGroup} guidance selected</Text><Text style={styles.metaText}>{total} min total</Text></View>
    </View>

    <View style={styles.section}>
      <View style={styles.sectionHeader}><Text style={styles.sectionTitle}>Your session flow</Text><Text style={styles.saved}>{hasLoadedDraft ? "Saved locally" : "Loading..."}</Text></View>
      <View style={styles.blockList}>{draft.blocks.map((block, index) => {
        const drill = findDrill(block.drillId, library);
        return <View key={block.id} style={styles.block}>
          <View style={styles.number}><Text style={styles.numberText}>{index + 1}</Text></View>
          <View style={styles.blockCopy}><Text style={styles.category}>{drill.category}</Text><Text style={styles.blockTitle}>{drill.title}</Text><Text style={styles.description}>{drill.description}</Text></View>
          <View style={styles.actions}>
            <View style={styles.timeControls}>
              <Pressable accessibilityLabel={`Decrease ${drill.title} duration`} onPress={() => changeMinutes(block.id, -1)} style={styles.timeButton}><Text style={styles.timeButtonText}>-</Text></Pressable>
              <Text style={styles.time}>{block.minutes}m</Text>
              <Pressable accessibilityLabel={`Increase ${drill.title} duration`} onPress={() => changeMinutes(block.id, 1)} style={styles.timeButton}><Text style={styles.timeButtonText}>+</Text></Pressable>
            </View>
            <Pressable accessibilityLabel={`Remove ${drill.title}`} onPress={() => setDraft((current) => ({ ...current, blocks: current.blocks.filter((item) => item.id !== block.id) }))}><Text style={styles.remove}>Remove</Text></Pressable>
          </View>
        </View>;
      })}</View>
    </View>

    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Add your own drill</Text>
      <Text style={styles.hint}>Keep your best activities ready to use in every session.</Text>
      <View style={styles.customForm}>
        <TextInput accessibilityLabel="Custom drill title" onChangeText={(value) => updateDrillForm("title", value)} placeholder="Drill name" placeholderTextColor="#7a8278" style={styles.formInput} value={drillForm.title} />
        <View style={styles.detailRow}>
          <TextInput accessibilityLabel="Custom drill category" onChangeText={(value) => updateDrillForm("category", value)} placeholder="Category" placeholderTextColor="#7a8278" style={[styles.formInput, styles.halfInput]} value={drillForm.category} />
          <TextInput accessibilityLabel="Custom drill duration" keyboardType="number-pad" onChangeText={(value) => updateDrillForm("defaultMinutes", value)} placeholder="Minutes" placeholderTextColor="#7a8278" style={[styles.formInput, styles.halfInput]} value={drillForm.defaultMinutes} />
        </View>
        <TextInput accessibilityLabel="Custom drill description" multiline onChangeText={(value) => updateDrillForm("description", value)} placeholder="What do the players do?" placeholderTextColor="#7a8278" style={[styles.formInput, styles.notesInput]} value={drillForm.description} />
        <TextInput accessibilityLabel="Custom drill equipment" onChangeText={(value) => updateDrillForm("equipment", value)} placeholder="Equipment needed" placeholderTextColor="#7a8278" style={styles.formInput} value={drillForm.equipment} />
        <Pressable accessibilityLabel="Save custom drill" disabled={!drillForm.title.trim()} onPress={addCustomDrill} style={[styles.saveButton, !drillForm.title.trim() && styles.saveButtonDisabled]}><Text style={styles.saveButtonText}>Save to your drills</Text></Pressable>
      </View>
    </View>

    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Drill library</Text>
      <Text style={styles.hint}>Quick, adaptable games to shape into your own session.</Text>
      <View style={styles.library}>{library.map((drill) => <View key={drill.id} style={styles.drillCard}>
        <View style={styles.drillTop}><Text style={styles.category}>{drill.category}</Text><Text style={styles.drillTime}>{drill.defaultMinutes} min</Text></View>
        <Text style={styles.drillTitle}>{drill.title}</Text><Text style={styles.description}>{drill.description}</Text><Text style={styles.equipment}>{drill.equipment}</Text>
        <Pressable accessibilityLabel={`Add ${drill.title} to session`} onPress={() => addDrill(drill.id)} style={styles.addButton}><Text style={styles.addButtonText}>Add to session</Text></Pressable>
      </View>)}</View>
    </View>
  </View>;
}

const styles = StyleSheet.create({
  actions: { alignItems: "flex-end", gap: 8 }, addButton: { alignItems: "center", backgroundColor: "#dce8b1", borderRadius: 8, marginTop: 10, paddingVertical: 9 }, addButtonText: { color: "#18321f", fontSize: 13, fontWeight: "800" }, block: { backgroundColor: "#f8f5ed", borderColor: "#ded7c8", borderRadius: 12, borderWidth: 1, flexDirection: "row", gap: 10, padding: 13 }, blockCopy: { flex: 1, gap: 3 }, blockList: { gap: 8 }, blockTitle: { color: "#1a2a1e", fontSize: 16, fontWeight: "800" }, category: { color: "#6b7667", fontSize: 10, fontWeight: "800", letterSpacing: 1, textTransform: "uppercase" }, container: { gap: 22 }, customForm: { backgroundColor: "#f8f5ed", borderColor: "#ded7c8", borderRadius: 12, borderWidth: 1, gap: 9, padding: 13 }, description: { color: "#657063", fontSize: 12, lineHeight: 17 }, detailRow: { flexDirection: "row", gap: 9 }, drillCard: { backgroundColor: "#f8f5ed", borderColor: "#ded7c8", borderRadius: 12, borderWidth: 1, padding: 14 }, drillTime: { color: "#526051", fontSize: 12, fontWeight: "800" }, drillTitle: { color: "#1a2a1e", fontSize: 17, fontWeight: "800", marginTop: 5 }, drillTop: { flexDirection: "row", justifyContent: "space-between" }, equipment: { color: "#6c7567", fontSize: 11, fontStyle: "italic", marginTop: 8 }, formInput: { backgroundColor: "#ffffff", borderColor: "#d8d1c4", borderRadius: 8, borderWidth: 1, color: "#1a2a1e", fontSize: 14, paddingHorizontal: 11, paddingVertical: 10 }, halfInput: { flex: 1 }, hint: { color: "#626d60", fontSize: 14, lineHeight: 20 }, library: { gap: 10 }, meta: { borderTopColor: "#46604d", borderTopWidth: StyleSheet.hairlineWidth, flexDirection: "row", justifyContent: "space-between", paddingTop: 10 }, metaText: { color: "#d6e1d2", fontSize: 12 }, notesInput: { minHeight: 70, textAlignVertical: "top" }, number: { alignItems: "center", backgroundColor: "#e5ebc7", borderRadius: 8, height: 25, justifyContent: "center", width: 25 }, numberText: { color: "#18321f", fontSize: 12, fontWeight: "800" }, remove: { color: "#9a6656", fontSize: 11, fontWeight: "800" }, saveButton: { alignItems: "center", backgroundColor: "#19382a", borderRadius: 8, paddingVertical: 10 }, saveButtonDisabled: { backgroundColor: "#829083" }, saveButtonText: { color: "#ffffff", fontSize: 13, fontWeight: "800" }, saved: { color: "#687464", fontSize: 11, fontWeight: "700" }, section: { gap: 10 }, sectionHeader: { alignItems: "center", flexDirection: "row", justifyContent: "space-between" }, sectionTitle: { color: "#1a2a1e", fontFamily: "Avenir Next Condensed", fontSize: 23, fontWeight: "800", letterSpacing: -0.3 }, sessionCard: { backgroundColor: "#19382a", borderRadius: 14, gap: 10, padding: 20 }, time: { color: "#1a2a1e", fontSize: 13, fontWeight: "800", minWidth: 29, textAlign: "center" }, timeButton: { alignItems: "center", backgroundColor: "#e5ebc7", borderRadius: 7, height: 26, justifyContent: "center", width: 26 }, timeButtonText: { color: "#18321f", fontSize: 16, fontWeight: "800", lineHeight: 18 }, timeControls: { alignItems: "center", flexDirection: "row", gap: 5 }, titleInput: { color: "#ffffff", fontFamily: "Avenir Next Condensed", fontSize: 31, fontWeight: "800", letterSpacing: -0.7, padding: 0 }
});
