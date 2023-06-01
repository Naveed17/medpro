import React from "react";

import {Document, Font, Page, StyleSheet, Text, View} from '@react-pdf/renderer';
import moment from "moment";

Font.register({
    family: 'Poppins',
    src: 'https://fonts.gstatic.com/s/oswald/v13/Y_TKV6o8WovbUd3m_X9aAA.ttf'
});

// @ts-ignore
const styles = StyleSheet.create({
    body: {
        paddingTop: 35,
        paddingBottom: 65,
        paddingHorizontal: 35,
    },
    title: {
        fontSize: 28,
        color: "#0696d6",
        marginBottom: 8
        //textAlign: 'center',
    },
    info: {
        fontSize: 16,
        color: "#7C878E",
        marginBottom: 4
    },
    subtitle: {
        fontSize: 20,
        paddingTop: 10,
        marginBottom: 10,
    },
    separator: {
        borderStyle: "solid",
        borderWidth: 1,
        borderColor: "black",
        borderRightWidth: 0,
        borderBottomWidth: 0,
        borderLeftWidth: 0,
        width: 80,
        marginTop: 25,
        marginBottom: 5
    },
    text: {
        margin: '5px 15px 10px',
        fontSize: 14,
        textAlign: 'justify',
    },
    image: {
        marginVertical: 15,
        marginHorizontal: 100,
    },
    header: {
        fontSize: 12,
        color: 'grey',
    }, antecedent: {
        fontSize: 15,
        marginTop: 5,
        marginBottom: 5,
        color: 'grey',
        fontWeight: 700
    },
    medicalRecord: {
        textAlign: "right",
        fontSize: 28
    },
    pageNumber: {
        position: 'absolute',
        fontSize: 12,
        bottom: 30,
        left: 0,
        right: 0,
        textAlign: 'center',
        color: 'grey',
    },
    table: {
        display: "flex",
        width: "auto",
    },
    tableRow: {
        margin: "auto",
        flexDirection: "row"
    },
    tableCol: {
        width: "50%",
    }
});

function PatientFile({...props}) {
    const {patient, antecedentsData, t, allAntecedents} = props

    const checkKey = (key: string) => {
        return key !== "submit" && key !== "adultTeeth" && key !== "childTeeth";
    }

    return (
        <Document>
            {patient && <Page style={styles.body}>
                <View>
                    <Text style={styles.medicalRecord}>Dossier médical</Text>
                    <Text style={{
                        ...styles.header,
                        textAlign: "right",
                        marginTop: 5,
                        fontSize: 15
                    }}>N°{patient?.fiche_id}</Text>
                </View>
                <Text
                    style={styles.title}>{patient?.gender === 'M' ? 'Mr. ' : 'Mme. '}{patient?.firstName} {patient?.lastName}</Text>
                {patient?.birthdate && patient?.birthdate !== 'null' && patient?.birthdate !== "" && <Text style={{
                    ...styles.info, color: "black"
                }}>{patient?.birthdate} - {moment().diff(moment(patient.birthdate, "DD-MM-YYYY"), 'years')} ans</Text>}
                {patient?.contact &&
                    <Text style={styles.info}>{patient?.contact[0].code} {patient?.contact[0].value}</Text>}

                <View style={styles.separator}></View>
                <Text style={styles.subtitle}>Informations personnelles</Text>
                {
                    patient?.address && patient?.address.length > 0 && <View>
                        <Text style={styles.header}>Adresse</Text>
                        {patient?.address && patient?.address?.map((adr: any, index: number) => (
                                <Text style={styles.text}
                                      key={`${index}-adr`}>
                                    {adr.postalCode} {adr.street} {adr.city?.name}, {adr.city?.country.name}
                                </Text>
                            )
                        )}
                    </View>
                }

                {patient?.profession && patient?.profession !== 'null' && patient?.profession !== "" &&
                    <View>
                        <Text style={styles.header}>Profession</Text>
                        <Text style={styles.text}>{patient?.profession}</Text>
                    </View>
                }

                {patient?.nationality && <View>
                    <Text style={styles.header}>Nationalité</Text>
                    <Text style={styles.text}>{patient?.nationality?.name}</Text>
                </View>}

                {patient?.email && patient?.email !== 'null' && patient?.email !== "" && <View>
                    <Text style={styles.header}>Email</Text>
                    <Text style={styles.text}>{patient?.email}</Text>
                </View>}

                {patient?.familyDoctor && patient?.familyDoctor !== 'null' && patient?.familyDoctor !== "" && <View>
                    <Text style={styles.header}>Médecin de famille</Text>
                    <Text style={styles.text}>{patient?.familyDoctor}</Text>
                </View>}

                {patient?.insurances && patient?.insurances.length > 0 &&
                    <Text style={{...styles.header, marginBottom: 10}}>Assurances</Text>}
                {
                    patient?.insurances && patient?.insurances?.map((insurance:any , index: number) => (
                            <Text style={styles.text}
                                  key={`${index}-insurance`}>• {insurance.insurance.name} - {insurance.insuranceNumber}</Text>
                        )
                    )
                }

                {antecedentsData && Object.keys(antecedentsData).length > 0 && <View style={styles.separator}></View>}
                {antecedentsData && Object.keys(antecedentsData).length > 0 &&
                    <Text style={styles.subtitle}>Antécédents</Text>}
                {
                    antecedentsData && Object.keys(antecedentsData)?.map(key => (
                        <View key={`${key}-ant`}>
                            <Text style={styles.antecedent}>{allAntecedents?.find((a:{slug:string}) => a.slug === key).name}</Text>
                            {antecedentsData[key] && Array.isArray(antecedentsData[key]) && antecedentsData[key]?.map((item: {
                                uuid: string;
                                name: string ;
                                startDate: string;
                                endDate: string;
                                response: string | any[];
                            }) => (
                                <Text style={{...styles.text, marginLeft: 10, marginBottom: 5}}
                                      key={item.uuid}>• {item.name} {item.startDate ? " / " + item.startDate : ""}{" "}{item.endDate ? " - " + item.endDate : ""}{(item as any).ascendantOf && `(${t("filter." + (item as any).ascendantOf)})`}{item.response ? typeof item.response === "string" ? '(' + item.response + ')' : item.response.length > 0 ? '(' + item.response[0]?.value + ')' : '' : ''}</Text>
                            ))}
                        </View>
                    ))
                }


                {patient?.treatment.length > 0 && <View style={styles.separator}></View>}
                {patient?.treatment.length > 0 && <Text style={styles.subtitle}>Traitement en cours</Text>}
                {
                    patient?.treatment?.map((list: {
                        uuid: string;
                        name: string ;
                        duration: number;
                        durationType: string;
                    }) => (
                        <Text style={{...styles.text, marginLeft: 10, marginBottom: 5}}
                              key={list.uuid}>• {list.name} {list.duration > 0 ? ` / ${list.duration} ${t("filter." + list.durationType)}` : ''}</Text>
                    ))
                }


                {patient?.requestedAnalyses.length > 0 && <View style={styles.separator}></View>}
                {patient?.requestedAnalyses.length > 0 && <Text style={styles.subtitle}>Analyses demandées</Text>}
                {
                    patient?.requestedAnalyses?.map((ra: {
                        uuid: any;
                        appointment: moment.MomentInput;
                        hasAnalysis: {
                            uuid: string;
                            analysis: { name: string ; };
                            result: string;
                        }[];
                    }) => (
                        <View key={`${ra.uuid}-ant`}>
                            <Text
                                style={styles.antecedent}>{moment(ra?.appointment, "DD-MM-YYYY").format("MMM DD/YYYY")}</Text>
                            {ra.hasAnalysis?.map((item: {
                                uuid: string;
                                analysis: {
                                    name: string;
                                };
                                result: string;
                            }) => (
                                <Text style={{...styles.text, marginLeft: 10, marginBottom: 5}}
                                      key={item.uuid}>• {item.analysis.name}{" "}{item.result ? "/" + item.result : ""}</Text>
                            ))}
                        </View>
                    ))
                }


                {patient?.requestedImaging.length > 0 && <View style={styles.separator}></View>}
                {patient?.requestedImaging.length > 0 && <Text style={styles.subtitle}>Imagerie demandée</Text>}
                {
                    patient?.requestedImaging?.map((ri: any) => (
                        <View key={`${ri.uuid}-ant`}>
                            <Text style={styles.antecedent}>{moment(ri?.appointment.dayDate, "DD-MM-YYYY").format(
                                "MMM DD/YYYY"
                            )}</Text>
                            {ri["medical-imaging"]?.map((item: any) => (
                                <Text style={{...styles.text, marginLeft: 10, marginBottom: 5}}
                                      key={item.uuid}>• {item["medical-imaging"]?.name}</Text>
                            ))}
                        </View>
                    ))
                }


                {patient?.previousAppointments.length > 0 &&
                    <View style={styles.separator}></View>}

                {patient?.previousAppointments.length > 0 &&
                    <Text style={styles.subtitle}>Historique des rendez-vous</Text>}
                {
                    patient?.previousAppointments?.map((appointment: {
                        uuid: any;
                        appointmentData: any[];
                        dayDate: moment.MomentInput;
                        startTime: string ;
                    }) => (
                        <View key={`${appointment.uuid}-ant`}>
                            {appointment.appointmentData.length > 0 &&
                                <Text
                                    style={styles.antecedent}>{moment(appointment.dayDate, "DD-MM-YYYY").format("MMM DD/YYYY")} {appointment.startTime}</Text>}
                            <View style={styles.table}>
                                <View style={styles.tableRow}>
                                    <View style={styles.tableCol}>
                                        {appointment.appointmentData?.map(data => (
                                            data.name !== 'models' &&
                                            <Text style={{...styles.text, marginLeft: 10, marginBottom: 5}}
                                                  key={`${data.uuid}`}>• {t("filter." + data.name)}: {data.value ? data.value : "--"}</Text>
                                        ))}
                                    </View>
                                    <View style={styles.tableCol}>
                                        {appointment.appointmentData?.map(data => (
                                            data.name === 'models' &&
                                            Object.keys(data.data)?.map(model => (
                                                checkKey(model) && <Text style={{
                                                    ...styles.text,
                                                    marginLeft: 10,
                                                    marginBottom: 5
                                                }}
                                                                         key={`${data.uuid}`}>• {model}: {data.data[model] ? data.data[model] : "--"}</Text>
                                            ))
                                        ))}
                                    </View>
                                </View>
                            </View>
                        </View>
                    ))
                }

                <Text style={styles.pageNumber} render={({pageNumber, totalPages}) => (
                    `${pageNumber} / ${totalPages}`
                )} fixed/>
            </Page>}
        </Document>
    );
}

export default PatientFile
