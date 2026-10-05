
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import { TodoListCard } from './components/TodoListCard';
import { Greeting } from './components/Greeting';

function App() {
    return (
        <Container>
            <Row>
                <Col md={{ offset: 3, span: 6 }}>
                    <Greeting />
                    <p>Version 2 - Deployed automatically by Jenkins</p>
                    <TodoListCard />
                </Col>
            </Row>
        </Container>
    );
}

export default App;
