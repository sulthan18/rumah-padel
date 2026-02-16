import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
  Button,
} from '@react-email/components';

interface WaitlistNotificationEmailProps {
  customerName: string;
  courtName: string;
  date: string;
  time: string;
}

export const WaitlistNotificationEmail = ({
  customerName,
  courtName,
  date,
  time,
}: WaitlistNotificationEmailProps) => (
  <Html>
    <Head />
    <Preview>A slot you were waiting for is now available!</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={heading}>Slot Available!</Heading>
        <Text style={paragraph}>Hi {customerName},</Text>
        <Text style={paragraph}>
          A slot you were on the waitlist for is now available for booking:
        </Text>
        <Text style={paragraph}>
          <strong>Court:</strong> {courtName}
          <br />
          <strong>Date:</strong> {date}
          <br />
          <strong>Time:</strong> {time}
        </Text>
        <Button style={button} href={`${process.env.NEXT_PUBLIC_APP_URL}/booking`}>
          Book Now
        </Button>
        <Text style={paragraph}>
          This slot is now available to everyone, so book it fast before it's gone!
        </Text>
      </Container>
    </Body>
  </Html>
);

export default WaitlistNotificationEmail;

const main = {
  backgroundColor: '#f6f9fc',
  fontFamily: 'Arial, sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
};

const heading = {
  fontSize: '28px',
  fontWeight: 'bold',
  marginTop: '0',
  textAlign: 'center' as const,
  color: '#1a1a1a',
};

const paragraph = {
  fontSize: '16px',
  lineHeight: '26px',
  color: '#333333',
  padding: '0 20px',
};

const button = {
  backgroundColor: '#007bff',
  borderRadius: '3px',
  color: '#fff',
  fontSize: '16px',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'block',
  width: '120px',
  padding: '12px',
  margin: '0 auto',
};
