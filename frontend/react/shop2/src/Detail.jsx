import { useParams } from "react-router-dom";
import styled from "styled-components";

function Detail(props) {

  let {id} = useParams();
  let foundShoe = props.shoes.find(shoe => shoe.id === Number(id));

  let DetailBtn = styled.button`
    border: 0px;
    background: ${props => props.bg};
    color : ${props => props.bg == "lightblue" ? "black" : "white"};
    border-radius: 10px;
    padding: 10px;
  `;
  // let NewBtn = styled.Button(DetailBtn);
  // styled.Button(DetailBtn)`
  //   ...
  // `; //(참고2)
  let DetailBox = styled.div`
    border: 1px white;
    background-color: darkgray;
    border-radius: 10px;
    padding: 10px;
  `;

  return (
    <div className="container">
      <DetailBox>
        <DetailBtn bg="lightblue">버튼</DetailBtn>
        <DetailBtn bg="gray">버튼</DetailBtn>
      </DetailBox>
        <div className="row">
          <div className="col-md-6">
            {foundShoe == null ? (
              <div>404 NOT FOUND</div>
            ) : (
              <div>
                <img src={"/shoe" + id + ".jpeg"} width="100%" />
                <h4 className="pt-5">{foundShoe.title}</h4>
                <p>{foundShoe.content}</p>
                <button className="btn btn-danger">주문하기</button> 
                <p>{foundShoe.price}원</p>
              </div>
            )}
          </div>
        </div>
    </div> 
  )
}

export default Detail;