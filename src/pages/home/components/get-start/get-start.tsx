import "./get-start.scss";
import React from 'react';
import Row from "../../../../components/row/row";
import Col from "../../../../components/col/col";
import Container from "../../../../components/container/container";
import {startItems} from './constants';
import StartItem from "./components/start-item/start-item";
const GetStart = () => {
  return (
    <section className="get-start">
      <Container>
        <Row  className="text-center text-md-start">
          <Col md={12} lg={6}>
            <div className="get-start__demo">
              <img src="/assets/images/easy-illustration_optimized.png" alt=""/>
            </div>
          </Col>
          <Col md={6}>
            <div className="feature-text">
              <p className="feature-text__title has-text-primary text-capitalize">Lorem ipsum dolor sit.</p>
              <h2 className="mb-4">Getting started is easy</h2>
              {startItems.map((startItem, i)=> (
                  <StartItem item={startItem} key={i}/>
              ))}
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default GetStart;
