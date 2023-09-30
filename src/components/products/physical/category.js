import React, { Fragment, useEffect, useState } from "react";
import Breadcrumb from "../../common/breadcrumb";
import "react-toastify/dist/ReactToastify.css";
// import { data } from "../../../assets/data/category";
import Datatable from "../../common/datatable";
import {
	Button,
	Card,
	CardBody,
	CardHeader,
	Col,
	Container,
	Form,
	FormGroup,
	Input,
	Label,
	Modal,
	ModalBody,
	ModalFooter,
	ModalHeader,
	Row,
} from "reactstrap";
import { deleteDataById, getData, getDataById, postData, putDataById } from "../../../helpers/apiCaller";
import { toast } from "react-toastify";

const Category = () => {
	const [data, setData] = useState([])
	const [isUpdate, setIsUpdate] = useState(false)
	const [formData, setFormData] = useState({
		name: ''
	});

	const header = {
		id: 'id',
		nombre: 'name'
	}

	useEffect(() => {
		getCategories()
	}, [])

	const getCategories = async () => {
		let dataCategories = await getData('categorias')

		dataCategories = dataCategories.map(item => {
			return {
				id: item[0],
				name: item[1],
			}
		})

		setData(dataCategories)
		onCloseModal()
	}

	const handleCreate = async () => {
		await postData('categorias', { ...formData, image: '' })
			.then(_ => {
				toast.success("Creado correctamente")
				getCategories()
			})
	}

	const handleUpdate = async () => {
		await putDataById('categorias', formData.id, { ...formData, image: '' })
			.then(_ => {
				toast.success("Modificado correctamente")
				getCategories()
			})
	}

	const handleDelete = async (id) => {
		await deleteDataById('categorias', id)
			.then(_ => {
				toast.success("Eliminado correctamente")
				getCategories()
			})
	}

	const handleChange = (event) => {
		const { name, value } = event.target
		setFormData({
			...formData,
			[name]: value,
		});
	};

	const openUpdate = (item) => {
		setOpen(true)
		setIsUpdate(true)
		setFormData(item)
	}




	const [open, setOpen] = useState(false);

	const onOpenModal = () => {
		setOpen(true);
	};

	const onCloseModal = () => {
		setOpen(false)
		setIsUpdate(false)
		setFormData({
			name: ''
		})
	};

	return (
		<Fragment>
			{/* <Breadcrumb title="Category" parent="Physical" /> */}
			{/* <!-- Container-fluid starts--> */}
			<Container fluid={true}>
				<Row>
					<Col sm="12">
						<Card>
							<CardHeader>
								<h5>Categorías</h5>
							</CardHeader>
							<CardBody>
								<div className="btn-popup pull-right">
									<Button
										type="button"
										color="primary"
										onClick={onOpenModal}
										data-toggle="modal"
										data-original-title="test"
										data-target="#exampleModal"
									>
										Agregar categoría
									</Button>
									<Modal isOpen={open} toggle={onCloseModal}>
										<ModalHeader toggle={onCloseModal}>
											<h5
												className="modal-title f-w-600"
												id="exampleModalLabel2"
											>
												{isUpdate ? 'Actualizar categoría' : 'Agregar categoría'}
											</h5>
										</ModalHeader>
										<Form>
											<ModalBody>
												<FormGroup>
													<Label
														htmlFor="recipient-name"
														className="col-form-label"
													>
														Nombre de la categoría :
													</Label>
													<Input
														type="text"
														className="form-control"
														name="name"
														value={formData.name}
														onChange={(event) => handleChange(event)}
													/>
												</FormGroup>
												{/* <FormGroup>
													<Label
														htmlFor="message-text"
														className="col-form-label"
													>
														Imagen de la categoría :
													</Label>
													<Input
														className="form-control"
														id="validationCustom02"
														type="file"
													/>
												</FormGroup> */}
											</ModalBody>
											<ModalFooter>
												<Button
													type="button"
													color="primary"
													onClick={() => isUpdate ? handleUpdate() : handleCreate()}
												>
													{isUpdate ? 'Actualizar' : 'Agregar'}
												</Button>
												<Button
													type="button"
													color="secondary"
													onClick={() => onCloseModal("VaryingMdo")}
												>
													Cancelar
												</Button>
											</ModalFooter>
										</Form>
									</Modal>
								</div>
								<div className="clearfix"></div>
								<div id="basicScenario" className="product-physical">
									<Datatable
										hasUpdate
										hasDelete
										myHeader={header}
										myData={data}
										multiSelectOption={false}
										pageSize={10}
										pagination={true}
										class="-striped -highlight"
										onUpdate={(dataItem) => openUpdate(dataItem)}
										onDelete={(id) => handleDelete(id)}
									/>
								</div>
							</CardBody>
						</Card>
					</Col>
				</Row>
			</Container>
			{/* <!-- Container-fluid Ends--> */}
		</Fragment>
	);
};

export default Category;
