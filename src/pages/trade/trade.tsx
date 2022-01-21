import React, {FC} from 'react';
import Container from "../../components/container/container";
import Row from "../../components/row/row";
import Col from "../../components/col/col";
import TradeForm from "./components/trade-form/trade-form";
import "./trade.scss";

interface ITradeProps {
}

const Trade: FC<ITradeProps> = () => {
  return (
    <Container className="trade mt-5 d-flex align-items-center justify-content-center">
      <Row className="justify-content-center  w-100 ">
        <Col md={4}>
          <TradeForm/>
        </Col>
      </Row>
    </Container>
  );
};

export default Trade;
