import React from "react";

import {Document, Font, Page, StyleSheet, Text, View} from '@react-pdf/renderer';
import moment from "moment";
import {useRequest} from "@lib/axios";
import {useAppSelector} from "@lib/redux/hooks";
import {dashLayoutSelector} from "@features/base";
import {useRouter} from "next/router";
import {useMedicalEntitySuffix} from "@lib/hooks";
import {useSession} from "next-auth/react";
import {PDFViewer} from "@react-pdf/renderer";

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
    const {patient, antecedentsData, t, allAntecedents} = props;
    const {data: session} = useSession();
    const router = useRouter();
    const {urlMedicalEntitySuffix} = useMedicalEntitySuffix();

    const {medicalEntityHasUser} = useAppSelector(dashLayoutSelector);

    const {data: httpPatientDetailsResponse} = useRequest(medicalEntityHasUser && patient ? {
        method: "GET",
        url: `${urlMedicalEntitySuffix}/mehu/${medicalEntityHasUser[0].uuid}/patients/${patient.uuid}/${router.locale}`,
        headers: {Authorization: `Bearer ${session?.accessToken}`}
    } : null);

    const checkKey = (key: string) => {
        return key !== "submit" && key !== "adultTeeth" && key !== "childTeeth";
    }

    const patientData = (httpPatientDetailsResponse as HttpResponse)?.data as PatientModel;

    return (
        <PDFViewer height={470}>
            <Document>
                {patientData && <Page style={styles.body}>
                    <View>
                        <Text style={styles.medicalRecord}>Dossier médical</Text>
                        <Text style={{
                            ...styles.header,
                            textAlign: "right",
                            marginTop: 5,
                            fontSize: 15
                        }}>N°{patientData?.fiche_id}</Text>
                    </View>
                    <Text
                        style={styles.title}>{patientData?.gender === 'M' ? 'Mr. ' : 'Mme. '}{patientData?.firstName} {patientData?.lastName}</Text>
                    {patientData?.birthdate && patientData?.birthdate !== 'null' && patientData?.birthdate !== "" &&
                        <Text style={{
                            ...styles.info, color: "black"
                        }}>{patientData?.birthdate} - {moment().diff(moment(patientData.birthdate, "DD-MM-YYYY"), 'years')} ans</Text>}
                    {patientData?.contact &&
                        <Text style={styles.info}>{patientData?.contact[0].code} {patientData?.contact[0].value}</Text>}

                    <View style={styles.separator}></View>
                    <Text style={styles.subtitle}>Informations personnelles</Text>
                    {
                        patientData?.address && patientData?.address.length > 0 && <View>
                            <Text style={styles.header}>Adresse</Text>
                            {patientData?.address && patientData?.address?.map((adr: any, index: number) => (
                                    <Text style={styles.text}
                                          key={`${index}-adr`}>
                                        {adr.postalCode} {adr.street} {adr.city?.name}, {adr.city?.country.name}
                                    </Text>
                                )
                            )}
                        </View>
                    }

                    {patientData?.profession && patientData?.profession !== 'null' && patientData?.profession !== "" &&
                        <View>
                            <Text style={styles.header}>Profession</Text>
                            <Text style={styles.text}>{patientData?.profession}</Text>
                        </View>
                    }

                    {patientData?.nationality && <View>
                        <Text style={styles.header}>Nationalité</Text>
                        <Text style={styles.text}>{patientData?.nationality?.name}</Text>
                    </View>}

                    {patientData?.email && patientData?.email !== 'null' && patientData?.email !== "" && <View>
                        <Text style={styles.header}>Email</Text>
                        <Text style={styles.text}>{patientData?.email}</Text>
                    </View>}

                    {patientData?.familyDoctor && patientData?.familyDoctor !== 'null' && patientData?.familyDoctor !== "" &&
                        <View>
                            <Text style={styles.header}>Médecin de famille</Text>
                            <Text style={styles.text}>{patientData?.familyDoctor}</Text>
                        </View>}

                    {patientData?.insurances && patientData?.insurances.length > 0 &&
                        <Text style={{...styles.header, marginBottom: 10}}>Assurances</Text>}
                    {
                        patientData?.insurances && patientData?.insurances?.map((insurance: any, index: number) => (
                                <Text style={styles.text}
                                      key={`${index}-insurance`}>• {insurance.insurance.name} - {insurance.insuranceNumber}</Text>
                            )
                        )
                    }

                    {antecedentsData && Object.keys(antecedentsData).length > 0 &&
                        <View style={styles.separator}></View>}
                    {antecedentsData && Object.keys(antecedentsData).length > 0 &&
                        <Text style={styles.subtitle}>Antécédents</Text>}
                    {
                        antecedentsData && Object.keys(antecedentsData)?.map(key => (
                            <View key={`${key}-ant`}>
                                <Text style={styles.antecedent}>{allAntecedents?.find((a: {
                                    slug: string
                                }) => a.slug === key)?.name}</Text>
                                {antecedentsData[key] && Array.isArray(antecedentsData[key]) && antecedentsData[key]?.map((item: {
                                    uuid: string;
                                    name: string;
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


                    {(patientData?.treatment && patientData.treatment?.length > 0) && <>
                        <View style={styles.separator}></View>
                        <Text style={styles.subtitle}>Traitement en cours</Text>
                    </>}
                    {patientData?.treatment?.map((list: {
                        uuid: string;
                        name: string;
                        duration: number;
                        durationType: string;
                    }) => (
                        <Text style={{...styles.text, marginLeft: 10, marginBottom: 5}}
                              key={list.uuid}>• {list.name} {list.duration > 0 ? ` / ${list.duration} ${t("filter." + list.durationType)}` : ''}</Text>
                    ))}

                    {patientData?.requestedAnalyses.length > 0 && <View style={styles.separator}></View>}
                    {patientData?.requestedAnalyses.length > 0 &&
                        <Text style={styles.subtitle}>Analyses demandées</Text>}
                    {
                        patientData?.requestedAnalyses?.map((ra: {
                            uuid: any;
                            appointment: moment.MomentInput;
                            hasAnalysis: {
                                uuid: string;
                                analysis: { name: string; };
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


                    {patientData?.requestedImaging.length > 0 && <View style={styles.separator}></View>}
                    {patientData?.requestedImaging.length > 0 && <Text style={styles.subtitle}>Imagerie demandée</Text>}
                    {
                        patientData?.requestedImaging?.map((ri: any) => (
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


                    {patientData?.previousAppointments.length > 0 &&
                        <View style={styles.separator}></View>}

                    {patientData?.previousAppointments.length > 0 &&
                        <Text style={styles.subtitle}>Historique des rendez-vous</Text>}
                    {
                        patientData?.previousAppointments?.map((appointment: {
                            uuid: any;
                            appointmentData: any[];
                            dayDate: moment.MomentInput;
                            startTime: string;
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
        </PDFViewer>
    );
}

export default PatientFile
