import React from "react";
import { useLocalSearchParams } from "expo-router";
import {
    ScrollView,
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
} from "react-native";

export default function BaseballDetailsPage() {
    const { fixture } = useLocalSearchParams();
    const parsedFixture = typeof fixture === "string" ? JSON.parse(fixture) : fixture;

    if (!parsedFixture) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>No match data available.</Text>
            </View>
        );
    }

    const formattedDate = new Date(parsedFixture.date).toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    });
    const formattedTime = new Date(parsedFixture.date).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
    });

    return (
        <ScrollView contentContainerStyle={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Image source={{ uri: parsedFixture.league.logo }} style={styles.leagueLogo} />
                <Text style={styles.matchTitle}>
                    {parsedFixture.teams.home.name} vs {parsedFixture.teams.away.name}
                </Text>
                <Text style={styles.matchDate}>{formattedDate}</Text>
                <Text style={styles.matchTime}>{formattedTime}</Text>
                <Text style={styles.matchStatus}>{parsedFixture.status.long}</Text>
            </View>

            {/* Teams Comparison */}
            <View style={styles.teamComparison}>
                <View style={styles.teamBlock}>
                    <Image source={{ uri: parsedFixture.teams.home.logo }} style={styles.teamLogo} />
                    <Text style={styles.teamName}>{parsedFixture.teams.home.name}</Text>
                    <Text style={styles.teamScore}>Runs: {parsedFixture.scores.home.total}</Text>
                </View>
                <Text style={styles.vs}>VS</Text>
                <View style={styles.teamBlock}>
                    <Image source={{ uri: parsedFixture.teams.away.logo }} style={styles.teamLogo} />
                    <Text style={styles.teamName}>{parsedFixture.teams.away.name}</Text>
                    <Text style={styles.teamScore}>Runs: {parsedFixture.scores.away.total}</Text>
                </View>
            </View>

            {/* Inning Breakdown */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Inning Breakdown</Text>
                <View style={styles.inningTable}>
                    <View style={styles.tableHeader}>
                        <Text style={styles.tableCell}>Inning</Text>
                        {Object.keys(parsedFixture.scores.home.innings).map((inning) => (
                            <Text key={inning} style={styles.tableCell}>
                                {inning}
                            </Text>
                        ))}
                    </View>
                    <View style={styles.tableRow}>
                        <Text style={styles.tableCell}>Home</Text>
                        {Object.values(parsedFixture.scores.home.innings).map((score, idx) => (
                            <Text key={idx} style={styles.tableCell}>
                                {score ?? "-"}
                            </Text>
                        ))}
                    </View>
                    <View style={styles.tableRow}>
                        <Text style={styles.tableCell}>Away</Text>
                        {Object.values(parsedFixture.scores.away.innings).map((score, idx) => (
                            <Text key={idx} style={styles.tableCell}>
                                {score ?? "-"}
                            </Text>
                        ))}
                    </View>
                </View>
            </View>

            {/* Stats Section */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Match Stats</Text>
                <View style={styles.statsRow}>
                    <View style={styles.statBlock}>
                        <Text style={styles.statLabel}>Hits (Home)</Text>
                        <Text style={styles.statValue}>{parsedFixture.scores.home.hits}</Text>
                    </View>
                    <View style={styles.statBlock}>
                        <Text style={styles.statLabel}>Hits (Away)</Text>
                        <Text style={styles.statValue}>{parsedFixture.scores.away.hits}</Text>
                    </View>
                </View>
                <View style={styles.statsRow}>
                    <View style={styles.statBlock}>
                        <Text style={styles.statLabel}>Errors (Home)</Text>
                        <Text style={styles.statValue}>{parsedFixture.scores.home.errors}</Text>
                    </View>
                    <View style={styles.statBlock}>
                        <Text style={styles.statLabel}>Errors (Away)</Text>
                        <Text style={styles.statValue}>{parsedFixture.scores.away.errors}</Text>
                    </View>
                </View>
            </View>

            {/* League Information */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>League Information</Text>
                <Text style={styles.leagueName}>{parsedFixture.league.name}</Text>
                <Text style={styles.leagueDetails}>
                    {parsedFixture.country.name} - {parsedFixture.league.type}
                </Text>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: "#f5f5f5",
    },
    header: {
        alignItems: "center",
        marginBottom: 20,
    },
    leagueLogo: {
        width: 60,
        height: 60,
        marginBottom: 10,
    },
    matchTitle: {
        fontSize: 24,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 5,
    },
    matchDate: {
        fontSize: 16,
        color: "#555",
    },
    matchTime: {
        fontSize: 16,
        color: "#555",
    },
    matchStatus: {
        fontSize: 18,
        color: "#888",
        fontWeight: "600",
        marginTop: 5,
    },
    teamComparison: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 20,
    },
    teamBlock: {
        alignItems: "center",
        flex: 1,
    },
    teamLogo: {
        width: 50,
        height: 50,
        marginBottom: 5,
    },
    teamName: {
        fontSize: 18,
        fontWeight: "600",
    },
    teamScore: {
        fontSize: 16,
        color: "#333",
    },
    vs: {
        fontSize: 20,
        fontWeight: "bold",
        marginHorizontal: 10,
    },
    section: {
        marginBottom: 20,
        backgroundColor: "#fff",
        padding: 15,
        borderRadius: 10,
        elevation: 3,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 10,
    },
    inningTable: {
        borderTopWidth: 1,
        borderTopColor: "#ccc",
    },
    tableHeader: {
        flexDirection: "row",
        backgroundColor: "#f7f7f7",
        paddingVertical: 5,
    },
    tableRow: {
        flexDirection: "row",
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
        paddingVertical: 5,
    },
    tableCell: {
        flex: 1,
        textAlign: "center",
        fontSize: 14,
    },
    statsRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginVertical: 10,
    },
    statBlock: {
        flex: 1,
        alignItems: "center",
        marginHorizontal: 5,
    },
    statLabel: {
        fontSize: 14,
        color: "#555",
    },
    statValue: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#000",
    },
    leagueName: {
        fontSize: 18,
        fontWeight: "600",
        textAlign: "center",
        marginBottom: 5,
    },
    leagueDetails: {
        fontSize: 16,
        color: "#555",
        textAlign: "center",
    },
    errorContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    errorText: {
        fontSize: 18,
        color: "red",
    },
});
