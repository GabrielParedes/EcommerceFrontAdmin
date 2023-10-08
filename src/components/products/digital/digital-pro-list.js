import React, { Fragment, useEffect, useState } from "react";
import Breadcrumb from "../../common/breadcrumb";
import data from "../../../assets/data/pro_list";
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
} from "reactstrap"; import { deleteDataById, getData, getDataById, postData, postImage, putDataById } from "../../../helpers/apiCaller";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from 'uuid';

import one from "../../../assets/images/pro3/1.jpg";
import user from "../../../assets/images/user.png";
import MDEditor from "@uiw/react-md-editor";
import Swal from "sweetalert2";

const Digital_pro_list = () => {
	const [data, setData] = useState([])
	const [categories, setCategories] = useState([])
	const [isUpdate, setIsUpdate] = useState(false)
	const [formData, setFormData] = useState({
		title: '',
		description: '',
		type: '',
		brand: '',
		category_id: 1,
		price: 0,
		sale: 0,
		discount: 0,
		stock: 0,
		new: 0
	});

	const [variantData, setVariantData] = useState({
		sku: '',
		size: 'S',
		color: '',
		product_id: '',
		image_id: ''
	})

	const [file, setFile] = useState()

	const header = {
		id: 'id',
		titulo: 'title',
		cantidad: 'stock',
		precio: 'price',
	}

	useEffect(() => {
		getCategories()
		getProducts()
	}, [])

	useEffect(() => {
		setFormData({
			...formData,
			category_id: categories[0]?.id || '',
		})
	}, [categories])

	const getCategories = async () => {
		let dataCategories = await getData('categorias')

		dataCategories = dataCategories.map(item => {
			return {
				id: item[0],
				name: item[1],
			}
		})

		setCategories(dataCategories)
		setFormData({ ...formData, category_id: dataCategories[0]?.id || '' })
		onCloseModal()
	}

	const getProducts = async () => {
		let dataProducts = await getData('productos')

		dataProducts = dataProducts.map(item => {
			return {
				id: item[0],
				title: item[1],
				description: item[2],
				type: item[3],
				brand: item[4],
				category_id: item[5],
				price: item[6],
				sale: item[7],
				discount: item[8],
				stock: item[9],
				new: item[10],
			}
		})

		setData(dataProducts)
		onCloseModal()
	}

	const handleCreate = async () => {
		console.log(formData)
		console.log(variantData)

		let error = false
		let exceptions = ['brand', 'discount', 'new', 'sale', 'type', 'color', 'product_id', 'image_id']

		Object.keys(formData).forEach((key) => {
			if (formData[key] == '' && !exceptions.includes(key)) {
				console.log(key)
				error = true
			}
		})

		Object.keys(variantData).forEach((key) => {
			if (variantData[key] == '' && !exceptions.includes(key)) {
				console.log(key)
				error = true
			}
		})

		if (error) {
			Swal.fire(
				'Error al crear producto',
				'Complete todos los campos',
				'warning'
			)
		} else {
			await postData('productos', { ...formData })
				.then(async resp => {
					toast.success("Creado correctamente")

					await postData('imagenes', { product_id: resp.id, id: uuidv4(), src: file, alt: '', color: '' })
						.then(async resp_img => {
							toast.success("Creado correctamente")

							await postData('variantes', { ...variantData, product_id: resp.id, id: uuidv4(), image_id: resp_img.id })
								.then(_ => {
									toast.success("Creado correctamente")
								})
						})

					getProducts()
				})
		}
	}

	const handleUpdate = async () => {
		console.log(formData)
		console.log(variantData)

		let error = false
		let exceptions = ['brand', 'discount', 'new', 'sale', 'type', 'color', 'product_id', 'image_id']

		Object.keys(formData).forEach((key) => {
			if (formData[key] == '' && !exceptions.includes(key)) {
				console.log(key)
				error = true
			}
		})

		Object.keys(variantData).forEach((key) => {
			if (variantData[key] == '' && !exceptions.includes(key)) {
				console.log(key)
				error = true
			}
		})

		if (error) {
			Swal.fire(
				'Error al modificar producto',
				'Complete todos los campos',
				'warning'
			)
		} else {
			await putDataById('productos', formData.id, { ...formData })
				.then(_ => {
					toast.success("Modificado correctamente")
				})

			await deleteDataById('variantes', formData.id)

			await deleteDataById('imagenes', formData.id)

			await postData('imagenes', { product_id: formData.id, id: uuidv4(), src: file, alt: '', color: '' })
				.then(async resp_img => {
					toast.success("Creado correctamente")

					await postData('variantes', { ...variantData, product_id: formData.id, id: uuidv4(), image_id: resp_img.id })
						.then(_ => {
							toast.success("Creado correctamente")
						})
				})

			getProducts()
		}

	}

	const handleDelete = async (id) => {
		await deleteDataById('imagenes', id)
			.then(_ => {
				toast.success("Eliminado correctamente")
			})

		await deleteDataById('variantes', id)
			.then(_ => {
				toast.success("Eliminado correctamente")
			})

		await deleteDataById('productos', id)
			.then(_ => {
				toast.success("Eliminado correctamente")
			})

		getProducts()
	}

	const handleChange = (event) => {
		const { name, value } = event.target

		console.log(name, value)

		setFormData({
			...formData,
			[name]: value,
		});
	};

	const handleChangeVariant = (event) => {
		const { name, value } = event.target

		console.log(name, value)

		setVariantData({
			...variantData,
			[name]: value,
		});
	};

	const openUpdate = (item) => {
		setOpen(true)
		setIsUpdate(true)
		setFormData(item)

		console.log(item)

		getDataById('imagenes', item.id)
			.then(resp => {
				setFile(resp[4])
			})

		getDataById('variantes', item.id)
			.then(resp => {
				let data = resp.map(item => ({
					variante_id: item[0],
					product_id: item[1],
					id: item[2],
					sku: item[3],
					size: item[4],
					color: item[5],
					image_id: item[6],
				}))

				// console.log(data)

				setVariantData(data[0])
			})

	}




	const [open, setOpen] = useState(false);

	const onOpenModal = () => {
		setOpen(true);
	};

	const onCloseModal = () => {
		setOpen(false)
		setIsUpdate(false)
		setFormData({
			title: '',
			description: '',
			type: '',
			brand: '',
			category_id: categories[0]?.id,
			price: 0,
			sale: 0,
			discount: 0,
			stock: 0,
			new: 0
		})
		setVariantData({
			sku: '',
			size: 'S',
			color: '',
			product_id: '',
			image_id: ''
		})
		setFile()
	};




	const _handleImgChange = async (e) => {
		e.preventDefault();
		let reader = new FileReader();
		const image = e.target.files[0];

		const formData = new FormData();
		formData.append('image', image);

		postImage(formData)
			.then(resp => {
				setFile(resp.url)
			})

		// reader.onload = () => {
		// 	let base64 = reader.result
		// 	setFile({ file: file });
		// };
		// reader.readAsDataURL(image);
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
								<h5>Productos</h5>
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
										Agregar producto
									</Button>
									<Modal isOpen={open} toggle={onCloseModal}>
										<ModalHeader toggle={onCloseModal}>
											<h5
												className="modal-title f-w-600"
												id="exampleModalLabel2"
											>
												{isUpdate ? 'Actualizar producto' : 'Agregar producto'}
											</h5>
										</ModalHeader>
										<Form>
											<ModalBody>
												<div className="form form-label-center">
													<FormGroup className="form-group mb-3 row">
														<Label className="col-xl-3 col-sm-4 mb-0">
															Nombre del producto :
														</Label>
														<div className="col-xl-8 col-sm-7">
															<Input
																className="form-control"
																type="text"
																name="title"
																value={formData.title}
																onChange={(event) => handleChange(event)}
																required
															/>
														</div>
													</FormGroup>
													<FormGroup className="form-group mb-3 row">
														<Label className="col-xl-3 col-sm-4 mb-0">
															Precio :
														</Label>
														<div className="col-xl-8 col-sm-7">
															<Input
																className="form-control mb-0"
																type="number"
																name="price"
																value={formData.price}
																onChange={(event) => handleChange(event)}
																required
															/>
														</div>
													</FormGroup>
													<FormGroup className="form-group mb-3 row">
														<Label className="col-xl-3 col-sm-4 mb-0">
															SKU :
														</Label>
														<div className="col-xl-8 col-sm-7">
															<Input
																className="form-control "
																type="number"
																name="sku"
																value={variantData.sku}
																onChange={(event) => handleChangeVariant(event)}
																required
															/>
														</div>
													</FormGroup>
												</div>
												<div className="form">
													<FormGroup className="form-group mb-3 row">
														<Label className="col-xl-3 col-sm-4 mb-0">
															Tamaño :
														</Label>
														<div className="col-xl-8 col-sm-7">
															<Input
																className="form-control "
																type="text"
																name="size"
																value={variantData.size}
																onChange={(event) => handleChangeVariant(event)}
																required
															/>
														</div>
													</FormGroup>
													<FormGroup className="form-group mb-3 row">
														<Label className="col-xl-3 col-sm-4 mb-0">
															Categoría :
														</Label>
														<div className="col-xl-8 col-sm-7">
															<select
																className="form-control digits"
																name="category_id"
																onChange={(event) => handleChange(event)}
																defaultValue={categories[0]?.id || ''}
																value={formData.category_id}
															>
																{
																	categories.map(category => (
																		<option key={category.id} value={category.id}>{category.name}</option>
																	))
																}
															</select>
														</div>
													</FormGroup>
													<FormGroup className="form-group mb-3 row">
														<Label className="col-xl-3 col-sm-4 mb-0">
															Cantidad :
														</Label>
														<div className="col-xl-8 col-sm-7">
															<Input
																className="touchspin form-control"
																type="number"
																name="stock"
																value={formData.stock}
																onChange={(event) => handleChange(event)}
															/>
														</div>
													</FormGroup>
													<FormGroup className="form-group mb-3 row">
														<Label className="col-xl-3 col-sm-4">
															Descripción :
														</Label>
														<div className="col-xl-8 col-sm-7 description-sm">
															<Input
																className="touchspin form-control"
																type="textarea"
																name="description"
																value={formData.description}
																onChange={(event) => handleChange(event)}
															/>
														</div>
													</FormGroup>
													<div className="box-input-file">
														<Input
															className="upload"
															type="file"
															onChange={(e) => _handleImgChange(e)}
														/>
														<img
															alt=""
															src={!file ? user : `https://gabrielparedes2000.pythonanywhere.com//${file}`}
															style={{ width: 50, height: 50 }}
														/>
													</div>
												</div>
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
										hasDelete
										hasUpdate
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

export default Digital_pro_list;
