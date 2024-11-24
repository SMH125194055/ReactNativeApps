import React from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
    Image,
    ScrollView,
    StyleSheet,
    Text,
    View,
    Animated,
    Dimensions,
} from "react-native";
import { PanGestureHandler, GestureHandlerRootView } from "react-native-gesture-handler";

export default function DetailsPage() {
    const { fixture } = useLocalSearchParams();
    const router = useRouter();

    if (!fixture) {
        return (
            <View style={styles.container}>
                <Text style={styles.errorText}>No fixture data available.</Text>
            </View>
        );
    }

    const parsedFixture = typeof fixture === "string" ? JSON.parse(fixture) : fixture;

    if (!parsedFixture) {
        return (
            <View style={styles.container}>
                <Text style={styles.errorText}>Error: Fixture data is invalid or missing.</Text>
            </View>
        );
    }

    const formattedDate = parsedFixture.fixture.date
        ? new Date(parsedFixture.fixture.date).toLocaleString()
        : "Invalid Date";

    const winner =
        parsedFixture.teams.home.winner !== null
            ? parsedFixture.teams.home.winner
                ? parsedFixture.teams.home.name
                : parsedFixture.teams.away.name
            : "TBD";

    const handleGesture = (event) => {
        if (event.nativeEvent.translationX > 50) {
            router.push("/(football)");
        }
    };

    return (
        <GestureHandlerRootView>
            <PanGestureHandler onGestureEvent={handleGesture}>
                <Animated.View style={styles.container}>
                    <ScrollView contentContainerStyle={styles.content}>
                        {/* Match Summary */}
                        <Section title="Match Summary">
                            <InfoRow label="Match Date" value={formattedDate} />
                            <InfoRow label="Status" value={parsedFixture.fixture.status.long} />
                            <InfoRow label="Winner" value={winner} />
                        </Section>

                        {/* Teams Overview */}
                        <Section title="Teams Overview">
                            <View style={styles.teamsContainer}>
                                <TeamDetail
                                    team={parsedFixture.teams.home}
                                    goals={parsedFixture.goals.home}
                                />
                                <Text style={styles.vs}>VS</Text>
                                <TeamDetail
                                    team={parsedFixture.teams.away}
                                    goals={parsedFixture.goals.away}
                                />
                            </View>
                        </Section>

                        {/* Score Details */}
                        <Section title="Score Details">
                            <InfoRow
                                label="Halftime Score"
                                value={`${parsedFixture.score.halftime.home} - ${parsedFixture.score.halftime.away}`}
                            />
                            <InfoRow
                                label="Fulltime Score"
                                value={`${parsedFixture.score.fulltime.home ?? "N/A"} - ${parsedFixture.score.fulltime.away ?? "N/A"}`}
                            />
                            <InfoRow
                                label="Extratime Score"
                                value={`${parsedFixture.score.extratime.home ?? "N/A"} - ${parsedFixture.score.extratime.away ?? "N/A"}`}
                            />
                            <InfoRow
                                label="Penalty Score"
                                value={`${parsedFixture.score.penalty.home ?? "N/A"} - ${parsedFixture.score.penalty.away ?? "N/A"}`}
                            />
                        </Section>

                        {/* League Details */}
                        <Section title="League Details">
                            <Image source={{ uri: parsedFixture.league.logo }} style={styles.logo} />
                            <Text style={styles.value}>{parsedFixture.league.name}</Text>
                            <Text style={styles.value}>Country: {parsedFixture.league.country}</Text>
                            <Text style={styles.value}>Round: {parsedFixture.league.round}</Text>
                        </Section>

                        {/* Venue Details */}
                        <Section title="Venue Information">
                            <InfoRow
                                label="Venue Name"
                                value={parsedFixture.fixture.venue.name}
                            />
                            <InfoRow label="City" value={parsedFixture.fixture.venue.city} />
                        </Section>

                        {/* Events */}
                        {parsedFixture.events && parsedFixture.events.length > 0 && (
                            <Section title="Match Events">
                                {parsedFixture.events.map((event, index) => (
                                    <View key={index} style={styles.event}>
                                        <Text style={styles.eventText}>{event.detail}</Text>
                                        <Text style={styles.eventTime}>Time: {event.time.elapsed} min</Text>
                                    </View>
                                ))}
                            </Section>
                        )}
                    </ScrollView>
                </Animated.View>
            </PanGestureHandler>
        </GestureHandlerRootView>
    );
}

const Section = ({ title, children }) => (
    <View style={styles.section}>
        <Text style={styles.title}>{title}</Text>
        {children}
    </View>
);

const InfoRow = ({ label, value }) => (
    <View style={styles.infoRow}>
        <Text style={styles.label}>{label}:</Text>
        <Text style={styles.value}>{value}</Text>
    </View>
);

const TeamDetail = ({ team, goals }) => (
    <View style={styles.team}>
        <Image source={{ uri: team.logo }} style={styles.teamLogo} />
        <Text style={styles.teamName}>{team.name}</Text>
        <Text style={styles.score}>Goals: {goals ?? "N/A"}</Text>
    </View>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f9f9f9",
    },
    content: {
        padding: 20,
    },
    errorText: {
        color: "red",
        textAlign: "center",
    },
    section: {
        marginBottom: 20,
        backgroundColor: "#fff",
        padding: 15,
        borderRadius: 10,
    },
    title: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 10,
    },
    infoRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 5,
    },
    label: {
        fontSize: 14,
        fontWeight: "600",
    },
    value: {
        fontSize: 14,
    },
    logo: {
        width: 50,
        height: 50,
    },
    teamsContainer: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
    },
    team: {
        flex: 1,
        alignItems: "center",
    },
    teamLogo: {
        width: 60,
        height: 60,
    },
    teamName: {
        fontSize: 16,
        fontWeight: "bold",
    },
    score: {
        fontSize: 14,
    },
    vs: {
        marginHorizontal: 10,
        fontSize: 16,
    },
    event: {
        backgroundColor: "#e6e6e6",
        padding: 10,
        marginBottom: 10,
        borderRadius: 8,
    },
    eventText: {
        fontSize: 14,
    },
    eventTime: {
        fontSize: 12,
        color: "#555",
    },
});
