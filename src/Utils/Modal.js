import {useState, useEffect} from 'react'
import {Button, Row, Col, Modal, Form, Container, Card, Badge, FormGroup} from 'react-bootstrap'
import {useForm} from 'react-hook-form'

import {deleteDataFromServer, getDataFromServer, putDataToServer} from './Common'
export const ModalForm = ()=>{
    const [showModal, setShowModal]=useState(false);
    const {handleSubmit, register} = useForm()
    const handleClose=()=> setShowModal(false)
    const handleShow=()=> setShowModal(true)
    const getComponent=(title, actionType, editDetail, action)=>{
        return (
            <Modal animation={false} show={showModal} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{title}</Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleSubmit(action)}><Form.Group>
                <Modal.Body>
                    {editDetail?'':<Form.Row>
                        <Form.Label as={Col}>Loại sản phẩm</Form.Label>
                        <Form.Group as={Col}>
                            {[1, 2, 3].map(type=>(
                                    <Form.Check key={type} inline type='radio' name='type' label={type} value={type} ref={register()}></Form.Check>
                                ))}
                        </Form.Group>
                    </Form.Row>}
                    <Form.Label>Khối lượng</Form.Label>
                    <Form.Control min='0' type='number' placeholder='Nhập khối lượng' name='amount' ref={register()}></Form.Control>
                    <Form.Label>Giá mua vào</Form.Label>
                    <Form.Control min='0' type='number' placeholder='Nhập giá mua vào' name='purchasePrice' ref={register()}></Form.Control>
                    <Form.Label>Giá bán ra</Form.Label>
                    <Form.Control min='0' type='number' placeholder='Nhâp giá bán ra' name='salePrice' ref={register()}></Form.Control>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Hủy
                    </Button>
                    <Button type='submit' variant="primary">
                        {actionType}
                    </Button>
                </Modal.Footer>
                </Form.Group></Form>
            </Modal>
        )
    }
    return{
        state: showModal,
        handleClose,
        handleShow,
        getComponent
    }
}
export const ModalAlert=()=>{
    const [showModal, setShowModal]=useState(false);
    const handleClose=()=> setShowModal(false)
    const handleShow=()=> setShowModal(true)
    const getComponent=(title, content, action)=>{
        return(
            <Modal animation={false} show={showModal} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>{content}</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Không
                    </Button>
                    <Button variant="danger" onClick={()=>action()}>
                        Có
                    </Button>
                </Modal.Footer>
            </Modal>
        )
    }
    return {
        state: showModal,
        handleClose,
        handleShow,
        getComponent
    }
}

export const ModalInvoice=()=>{
    const [showModal, setShowModal]=useState(false);
    const [cart, setCart] = useState([])
    const handleClose=()=> setShowModal(false)
    const handleShow=()=> setShowModal(true)

    const getComponent=(updateUserCart, customerId)=>{
        return(
            <Modal animation={false} show={showModal} onHide={handleClose} size='lg'>
            <Modal.Header closeButton>
                <Modal.Title>Hóa đơn</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Product type={1} data={cart} updateCart={updateUserCart} customerId={customerId}/>
                <Product type={2} data={cart} updateCart={updateUserCart} customerId={customerId}/>
            </Modal.Body>
            </Modal>
        )
    }
    return{
        state: showModal,
        handleClose,
        handleShow,
        setCart,
        getComponent
    }
}

const Product=(props)=>{
    let {type, data, updateCart, customerId} = props
    let [product, setProduct] = useState([])
    let {handleSubmit, register} = useForm()
    let [selectedProduct, setSelectedProduct] = useState(null)
    useEffect(()=>{
        const fetchData=async()=>{
            const data=await getDataFromServer('/api/product/all')
            setProduct(data.data)
        }
        fetchData()
    }, [])
    const handleChange=(e)=>{
        let userSelectedProduct = product.filter(value=>value.name===e.target.value)
        setSelectedProduct(userSelectedProduct[0])
    }
    const deleteDeal= async (dealId)=>{
        await deleteDataFromServer(`/api/customer/cart/${dealId}`)
        updateCart()
    }
    const onSubmit = async data=>{
        data.productId = selectedProduct._id
        data.type = parseInt(data.type)
        data.amount = parseInt(data.amount)
        data.buyInto = type===1?true:false
        await putDataToServer(`/api/customer/${customerId}/addToCart`, data)
        updateCart()
    }
    return(
        <Container>
            <Badge variant={type===1?'warning':'success'}>{type===1?'Mua vào':'Bán ra'}</Badge>
            <Container className='border border-success'>
            <Container>
            <Form onSubmit={handleSubmit(onSubmit)}><Row>
                <Col><Form.Group>
                        <Form.Control as='select' size='sm' custom onChange={handleChange}>
                            <option>--Chọn sản phẩm--</option>
                            {product.map((value, index)=>{
                                return(
                                    <option key={index}>{value.name}</option>
                                )
                            })}
                        </Form.Control>
                    </Form.Group></Col>
                    <Col><Form.Group>
                        <Form.Control as='select' size='sm' name='type' custom ref={register()}>
                            {selectedProduct?selectedProduct.classification.map((value, index)=>{
                                return <option key={index} value={value.type}>{value.type}</option>
                            }):<option>--Loại--</option>}
                        </Form.Control>
                    </Form.Group></Col>
                    <Col><FormGroup>
                    <Form.Control type='number' min='0' placeholder='Nhập số lượng' name='amount' custom ref={register()} required></Form.Control>
                    </FormGroup></Col>
                    <Col><Button type='submit' variant="success">
                        Thêm
                    </Button></Col>
                </Row></Form>
            </Container>
            {data.filter(value=>type===1?value.buyInto===true: value.buyInto===false).map((value, index)=>{
                    return(
                        <Container key={index} className='border-bottom'>
                            <Row><Card.Title className={type===1?'bg-warning':'bg-success'}>{value.productId.name}</Card.Title></Row>
                            <Row>
                                <Card.Text className='mr-5'>Loại: {value.type}</Card.Text>
                                <Card.Text>Khối lượng: {value.amount}</Card.Text>
                                <Button variant='primary' className='ml-auto btn-sm mb-2'>Sửa</Button>
                                <Button variant='danger' className='ml-1 btn-sm mb-2' onClick={()=>deleteDeal(value._id)}>Xóa</Button>
                            </Row>
                        </Container>
                    )
                })}
            </Container>
        </Container>
    )
}