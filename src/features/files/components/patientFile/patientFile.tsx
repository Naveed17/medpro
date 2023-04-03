import React from "react";

import {Document, Font, Image, Page, StyleSheet, Text, View} from '@react-pdf/renderer';
import moment from "moment";

Font.register({
    family: 'Poppins',
    src: 'https://fonts.gstatic.com/s/oswald/v13/Y_TKV6o8WovbUd3m_X9aAA.ttf'
});

const styles = StyleSheet.create({
    body: {
        paddingTop: 35,
        paddingBottom: 65,
        paddingHorizontal: 35,
    },
    title: {
        fontSize: 28,
        color:"#0696d6",
        marginBottom: 8
        //textAlign: 'center',
    },
    info: {
        fontSize: 18,
        color:"#7C878E",
        marginBottom: 4
    },
    subtitle: {
        fontSize: 24,
        marginBottom: 4,
        marginTop: 4
    },
    text: {
        margin: 12,
        fontSize: 14,
        textAlign: 'justify',
        fontFamily: 'Times-Roman'
    },
    image: {
        marginVertical: 15,
        marginHorizontal: 100,
    },
    header: {
        fontSize: 12,
        marginBottom: 20,
        textAlign: 'center',
        color: 'grey',
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
});

function PatientFile({...props}) {
    const {patient, antecedentsData, t} = props
    console.log(patient);

    return (
        <Document>
            {patient && <Page style={styles.body}>
               {/* <Text style={styles.header} fixed>
                    N°{patient?.fiche_id}
                </Text>*/}
                <Text style={styles.title}>{patient?.gender === 'M' ? 'Mr. ' : 'Mme. '}{patient?.firstName} {patient?.lastName}</Text>
                {patient?.birthdate && patient?.birthdate !== 'null' && patient?.birthdate !== "" && <Text style={styles.info}>{patient?.birthdate}</Text>}
                {patient?.contact && <Text style={styles.info}>{patient?.contact[0].code} {patient?.contact[0].value}</Text>}

                {patient?.address && patient?.address.map((adr, index: number) => (
                        <Text
                            key={`${index}-adr`}>{adr.postalCode} {adr.street} {adr.city.name}, {adr.city.country.name} </Text>
                    )
                )}
                {patient?.profession && patient?.profession !== 'null' && patient?.profession !== "" &&<Text>{patient?.profession}</Text>}

                <Text>Nationalité: {patient?.nationality?.name}</Text>
                <Text>email: {patient?.email && patient?.email !== 'null' && patient?.email !== "" ? patient?.email : "--"}</Text>
                <Text>Médecin de
                    famille: {patient?.familyDoctor && patient?.familyDoctor !== 'null' && patient?.familyDoctor !== "" ? patient?.familyDoctor : "--"}</Text>



                {Object.keys(antecedentsData).length > 0 && <Text style={styles.subtitle}>Antécédents</Text>}
                {
                    Object.keys(antecedentsData).map(key => (
                        <View key={`${key}-ant`}>
                            <Text>{t("filter." + key)}</Text>
                            {antecedentsData[key].map(item => (
                                <Text
                                    key={item.uuid}>• {item.name} {item.startDate ? " / " + item.startDate : ""}{" "}{item.endDate ? " - " + item.endDate : ""}{(item as any).ascendantOf && `(${t("filter." + (item as any).ascendantOf)})`}{item.response ? typeof item.response === "string" ? '(' + item.response + ')' : item.response.length > 0 ? '(' + item.response[0]?.value + ')' : '' : ''}</Text>
                            ))}
                        </View>
                    ))

                }


                {patient?.insurances && patient?.insurances.length > 0 && <Text style={styles.subtitle}>Assurances</Text>}
                {
                    patient?.insurances && patient?.insurances.map((insurance, index: number) => (
                            <Text key={`${index}-insurance`}>{insurance.insurance.name} - {insurance.insuranceNumber}</Text>
                        )
                    )
                }

                {patient?.treatment.length > 0 && <Text style={styles.subtitle}>Traitement en cours</Text>}
                {
                    patient?.treatment.map(list => (
                        <Text
                            key={list.uuid}>• {list.name} {list.duration > 0 ? ` / ${list.duration} ${t("filter." + list.durationType)}` : ''}</Text>
                    ))
                }


                {patient?.requestedAnalyses.length > 0 && <Text style={styles.subtitle}>Analyses demandées</Text>}
                {
                    patient?.requestedAnalyses.map(ra => (
                        <View key={`${ra.uuid}-ant`}>
                            <Text>{moment(ra?.appointment, "DD-MM-YYYY").format("MMM DD/YYYY")}</Text>
                            {ra.hasAnalysis.map(item => (
                                <Text
                                    key={item.uuid}>• {item.analysis.name}{" "}{item.result ? "/" + item.result : ""}</Text>
                            ))}
                        </View>
                    ))

                }


                {patient?.requestedImaging.length > 0 && <Text style={styles.subtitle}>Imagerie demandée</Text>}
                {
                    patient?.requestedImaging.map(ri => (
                        <View key={`${ri.uuid}-ant`}>
                            <Text>{moment(ri?.appointment.dayDate, "DD-MM-YYYY").format(
                                "MMM DD/YYYY"
                            )}</Text>
                            {ri["medical-imaging"].map(item => (
                                <Text
                                    key={item.uuid}>• {item["medical-imaging"]?.name}</Text>
                            ))}
                        </View>
                    ))
                }

                <Text style={styles.subtitle}>Historique des rendez-vous</Text>
                <Text>{patient?.previousAppointments.length}</Text>

                {
                    patient?.previousAppointments.map(appointment => (
                        <View key={`${appointment.uuid}-ant`}>
                            {appointment.appointmentData.length > 0 &&
                                <Text>{appointment.dayDate} {appointment.startTime}</Text>}
                            {appointment.appointmentData.map(data => (
                                data.name !== 'models' &&
                                <Text key={`${data.uuid}`}>• {data.name}: {data.value ? data.value : "--"}</Text>
                            ))}
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
