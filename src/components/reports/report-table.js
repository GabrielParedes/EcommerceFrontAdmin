import React, { Fragment } from "react";
import data from "../../assets/data/reports";
import Datatable from "../common/datatable";
import { useEffect } from "react";
import { useState } from "react";
import { getData, getDataById, putDataById } from "../../helpers/apiCaller";
import { Button, FormGroup, Label, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";

const ReportTable = () => {
	const [data, setData] = useState([])
	const [dataPurchase, setDataPurchase] = useState([])
	const [dataDetail, setDataDetail] = useState([])

	const header = {
		id: 'id',
		nombre: 'name',
		tipo_de_pago: 'payment_type',
		telefono: 'phone',
		email: 'email',
		total: 'total',
		status: 'status'
	}

	const headerDetail = {
		id: 'id',
		producto: 'product_title',
		cantidad: 'qty',
		subtotal: 'subtotal',
	}

	useEffect(() => {
		getPurchases()
	}, [])

	const showDetailPurchase = (id) => {
		console.log('showDetailPurchase')

		getDataById('compras', id)
			.then(resp => {
				console.log(resp)

				setDataPurchase(resp.purchase.map(item => {
					return {
						id: item[0],
						name: item[1],
						phone: item[2],
						email: item[3],
						address: item[4],
						total: item[5],
						payment_type: item[6],
						customer_id: item[7],
						status: item[8] || 'Pedido'
					}
				}))

				setDataDetail(resp.details.map((item, index) => {
					return {
						id: index + 1,
						product_id: item[1],
						qty: item[2],
						subtotal: item[3],
						purchase_id: item[4],
						product_title: item[5],
						product_description: item[6],
						product_image: item[7],
					}
				}))

				onOpenModal()
			})

	}

	const getPurchases = async () => {
		let dataPurchases = await getData('compras')

		console.log(dataPurchases)

		dataPurchases = dataPurchases.map(item => {
			return {
				id: item[0],
				name: item[1],
				phone: item[2],
				email: item[3],
				address: item[4],
				total: item[5],
				payment_type: item[6],
				customer_id: item[7],
				status: item[8] || 'Pedido'
			}
		})

		setData(dataPurchases)
	}

	const [open, setOpen] = useState(false);

	const onOpenModal = () => {
		setOpen(true);
	};

	const onCloseModal = () => {
		setOpen(false)
		setDataPurchase([])
		setDataDetail([])
		getPurchases()
		// setIsUpdate(false)
		// setFormData({
		// 	name: ''
		// })
	};

	const handleChangeStatus = async (id, status) => {
		console.log(id, status.target.value)

		await putDataById('compras/status', id, {status: status.target.value})
		.then(resp => {
			console.log(resp)
			showDetailPurchase(id)
		})
		.catch(err => {
			console.log('Error', err)
		})
	}

	return (
		<Fragment>
			<Modal isOpen={open} toggle={onCloseModal}>
				<ModalHeader toggle={onCloseModal}>
					<h5
						className="modal-title f-w-600"
						id="exampleModalLabel2"
					>
						Detalle de compra
					</h5>
				</ModalHeader>

				<ModalBody>
					<FormGroup>
						<Label>
							<b>Cliente :</b> {dataPurchase[0]?.name}
						</Label>
					</FormGroup>
					<FormGroup>
						<Label>
							<b>Teléfono :</b> {dataPurchase[0]?.phone}
						</Label>
					</FormGroup>
					<FormGroup>
						<Label>
							<b>Email :</b> {dataPurchase[0]?.email}
						</Label>
					</FormGroup>
					<FormGroup>
						<Label>
							<b>Dirección de entrega :</b> {dataPurchase[0]?.address}
						</Label>
					</FormGroup>
					<FormGroup>
						<Label>
							<b>Tipo de pago :</b> {dataPurchase[0]?.payment_type}
						</Label>
					</FormGroup>
					<FormGroup>
						<Label>
							<b>Total :</b> Q{dataPurchase[0]?.total}
						</Label>
					</FormGroup>
					<FormGroup>
						<Label>
							<b>Status :</b>
						</Label>
						<select
							value={dataPurchase[0]?.status}
							onChange={(value) => handleChangeStatus(dataPurchase[0]?.id, value)}
						>
							<option value={'Pedido'}>Pedido</option>
							<option value={'Pendiente de confirmar'}>Pendiente de confirmar</option>
							<option value={'Confirmado'}>Confirmado</option>
							<option value={'Sin empaquetar'}>Sin empaquetar</option>
							<option value={'Empaquetado'}>Empaquetado</option>
							<option value={'Enviado'}>Enviado</option>
							<option value={'Entregado'}>Entregado</option>
						</select>
					</FormGroup>
					<Datatable
						myHeader={headerDetail}
						multiSelectOption={false}
						myData={dataDetail}
						pageSize={12}
						pagination={false}
						class="-striped -highlight"
						onView={(id) => showDetailPurchase(id)}
					/>
				</ModalBody>
				<ModalFooter>
					<Button
						type="button"
						color="secondary"
						onClick={() => onCloseModal("VaryingMdo")}
					>
						Cerrar
					</Button>
				</ModalFooter>

			</Modal>
			<div className="translation-list">
				<Datatable
					hasView
					myHeader={header}
					multiSelectOption={false}
					myData={data}
					pageSize={12}
					pagination={false}
					class="-striped -highlight"
					onView={(id) => showDetailPurchase(id)}
				/>
			</div>
		</Fragment>
	);
};
export default ReportTable;
