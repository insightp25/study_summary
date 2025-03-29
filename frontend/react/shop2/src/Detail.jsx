import { useParams } from "react-router-dom";

function Detail(props) {

  let {id} = useParams();
  let foundShoe = props.shoes.find(shoe => shoe.id === Number(id));

  return (
    <div className="container">
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