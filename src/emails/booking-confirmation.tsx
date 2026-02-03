import {
    Body,
    Container,
    Column,
    Head,
    Heading,
    Hr,
    Html,
    Img,
    Link,
    Preview,
    Row,
    Section,
    Text,
} from "@react-email/components"
import * as React from "react"

interface BookingConfirmationEmailProps {
    bookingId: string
    customerName: string
    courtName: string
    date: string
    time: string
    price: string
    qrCodeUrl: string
}

const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000"

export const BookingConfirmationEmail = ({
    bookingId,
    customerName,
    courtName,
    date,
    time,
    price,
    qrCodeUrl,
}: BookingConfirmationEmailProps) => {
    return (
        <Html>
            <Head />
            <Preview>Tiket Booking Rumah Padel Anda: {bookingId}</Preview>
            <Body style={main}>
                <Container style={container}>
                    <Heading style={h1}>Rumah Padel</Heading>
                    <Text style={heroText}>Bukti Transaksi & Tiket Masuk</Text>

                    <Section style={{ marginBottom: "24px" }}>
                        <Text style={text}>Halo <strong>{customerName}</strong>,</Text>
                        <Text style={text}>
                            Terima kasih telah melakukan booking di Rumah Padel. Pembayaran Anda telah kami terima.
                            Berikut adalah detail tiket Anda:
                        </Text>
                    </Section>

                    <Section style={ticketContainer}>
                        <Section style={ticketHeader}>
                            <Text style={ticketTitle}>BOOKING TICKET</Text>
                            <Text style={ticketId}>{bookingId}</Text>
                        </Section>
                        <Section style={ticketBody}>
                            <Row style={{ marginBottom: "16px" }}>
                                <Column>
                                    <Text style={label}>Lapangan</Text>
                                    <Text style={value}>{courtName}</Text>
                                </Column>
                                <Column>
                                    <Text style={label}>Tanggal</Text>
                                    <Text style={value}>{date}</Text>
                                </Column>
                            </Row>
                            <Row style={{ marginBottom: "16px" }}>
                                <Column>
                                    <Text style={label}>Jam Main</Text>
                                    <Text style={value}>{time}</Text>
                                </Column>
                                <Column>
                                    <Text style={label}>Status</Text>
                                    <Text style={{ ...value, color: "#16a34a" }}>LUNAS</Text>
                                </Column>
                            </Row>
                            <Row>
                                <Column>
                                    <Text style={label}>Total Bayar</Text>
                                    <Text style={value}>{price}</Text>
                                </Column>
                            </Row>

                            <Hr style={{ borderColor: "#e5e7eb", margin: "20px 0" }} />

                            <Section style={{ textAlign: "center" as const }}>
                                <Img
                                    src={qrCodeUrl}
                                    width="150"
                                    height="150"
                                    alt="QR Code"
                                    style={{ margin: "0 auto" }}
                                />
                                <Text style={caption}>Tunjukkan QR ini kepada petugas</Text>
                            </Section>
                        </Section>
                    </Section>

                    <Section style={{ textAlign: "center" as const, marginTop: "24px" }}>
                        <Link href={`${baseUrl}/booking/confirmation/${bookingId}`} style={button}>
                            Lihat Tiket di Web
                        </Link>
                    </Section>

                    <Text style={footer}>
                        Rumah Padel Indonesia<br />
                        Jl. Padel No. 1, Jakarta<br />
                        hi@rumahpadel.com
                    </Text>
                </Container>
            </Body>
        </Html>
    )
}

const main = {
    backgroundColor: "#ffffff",
    fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
}

const container = {
    margin: "0 auto",
    padding: "20px 0 48px",
    maxWidth: "560px",
}

const h1 = {
    fontSize: "24px",
    fontWeight: "bold",
    textAlign: "center" as const,
    margin: "30px 0",
    color: "#09090b",
}

const heroText = {
    fontSize: "16px",
    textAlign: "center" as const,
    margin: "0 0 20px",
    color: "#71717a",
}

const text = {
    fontSize: "16px",
    lineHeight: "26px",
    color: "#09090b",
}

const ticketContainer = {
    border: "1px solid #e5e7eb",
    borderRadius: "12px",
    overflow: "hidden",
}

const ticketHeader = {
    backgroundColor: "#09090b",
    padding: "20px",
    textAlign: "center" as const,
}

const ticketTitle = {
    color: "#ffffff",
    fontSize: "14px",
    fontWeight: "bold",
    marginBottom: "4px",
    letterSpacing: "2px",
}

const ticketId = {
    color: "#a1a1aa",
    fontSize: "12px",
    fontFamily: "monospace",
}

const ticketBody = {
    padding: "24px",
    backgroundColor: "#fcfcfc",
}

const label = {
    fontSize: "12px",
    color: "#71717a",
    marginBottom: "4px",
    textTransform: "uppercase" as const,
}

const value = {
    fontSize: "16px",
    fontWeight: "600",
    color: "#09090b",
}

const caption = {
    fontSize: "12px",
    color: "#71717a",
    marginTop: "8px",
}

const button = {
    backgroundColor: "#09090b",
    borderRadius: "6px",
    color: "#fff",
    fontSize: "16px",
    fontWeight: "bold",
    textDecoration: "none",
    textAlign: "center" as const,
    display: "inline-block",
    padding: "12px 24px",
}

const footer = {
    color: "#71717a",
    fontSize: "12px",
    textAlign: "center" as const,
    marginTop: "48px",
}
