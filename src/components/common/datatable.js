import React, { Fragment, useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
	Button,
	Form,
	FormGroup,
	Input,
	Label,
	Modal,
	ModalBody,
	ModalFooter,
	ModalHeader,
} from "reactstrap";
import Swal from "sweetalert2";

const Datatable = ({ myData, myHeader, myClass, multiSelectOption, pagination, formUpdate, onDelete = () => { }, onUpdate = () => { }, onView = () => { }, hasView, hasDelete, hasUpdate }) => {
	const [open, setOpen] = useState(false);
	const [checkedValues, setCheckedValues] = useState([]);
	const [data, setData] = useState(myData);

	useEffect(() => {
		setData(myData)
	}, [myData])

	const selectRow = (e, i) => {
		if (!e.target.checked) {
			setCheckedValues(checkedValues.filter((item, j) => i !== item));
		} else {
			checkedValues.push(i);
			setCheckedValues(checkedValues);
		}
	};


	const handleRemoveRow = () => {
		const updatedData = myData.filter(function (el) {
			return checkedValues.indexOf(el.id) < 0;
		});
		setData([...updatedData]);
		toast.success("Successfully Deleted !");
	};

	const renderEditable = (cellInfo) => {
		return (
			<div
				style={{ backgroundColor: "#fafafa" }}
				contentEditable
				suppressContentEditableWarning
				onBlur={(e) => {
					data[cellInfo.index][cellInfo.index.id] = e.target.innerHTML;
					setData({ myData: data });
				}}
				dangerouslySetInnerHTML={{
					__html: myData[cellInfo.index][cellInfo.index.id],
				}}
			/>
		);
	};

	const handleDelete = (id) => {
		// if (window.confirm("Are you sure you wish to delete this item?")) {
		// 	const del = data;
		// 	del.splice(index, 1);
		// 	setData([...del]);
		// }
		// toast.success("Successfully Deleted !");


		Swal.fire({
			title: '¿Está seguro de eliminar este registro?',
			text: "Esta acción no se podrá revertir",
			icon: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			confirmButtonText: 'Si, eliminar',
			cancelButtonText: 'No, cancelar'
		}).then((result) => {
			if (result.isConfirmed) {
				onDelete(id)
			}
		})
	};

	const handleUpdate = (dataItem) => {
		onUpdate(dataItem)
	}

	const handleView = (id) => {
		console.log(id)

		onView(id)
	}



	const onOpenModal = () => {
		setOpen(true);
	};

	const onCloseModal = () => {
		setOpen(false);
	};

	const Capitalize = (str) => {
		return str.charAt(0).toUpperCase() + str.slice(1);
	};

	const columns = [];
	let headers = myHeader ? myHeader : myData[0]


	for (const key in headers) {
		let editable = renderEditable;
		if (key === "image") {
			editable = null;
		}
		if (key === "status") {
			editable = null;
		}
		if (key === "avtar") {
			editable = null;
		}
		if (key === "vendor") {
			editable = null;
		}
		if (key === "order_status") {
			editable = null;
		}

		columns.push({
			name: <b>{Capitalize(key.toString())}</b>,
			header: <b>{Capitalize(key.toString())}</b>,
			selector: row => myHeader ? row[myHeader[key]] : row[key],
			Cell: editable,
			style: {
				textAlign: "center",
			},
		});
	}

	if (multiSelectOption === true) {
		// columns.push({
		// 	name: (
		// 		<button
		// 			className="btn btn-danger btn-sm btn-delete mb-0 b-r-4"
		// 			onClick={(e) => {
		// 				if (window.confirm("Are you sure you wish to delete this item?"))
		// 					handleRemoveRow();
		// 			}}
		// 		>
		// 			Delete
		// 		</button>
		// 	),
		// 	id: "delete",
		// 	accessor: (str) => "delete",
		// 	cell: (row) => (
		// 		<div>
		// 			<span>
		// 				<input
		// 					type="checkbox"
		// 					name={row.id}
		// 					defaultChecked={checkedValues.includes(row.id)}
		// 					onChange={(e) => selectRow(e, row.id)}
		// 				/>
		// 			</span>
		// 		</div>
		// 	),
		// 	style: {
		// 		textAlign: "center",
		// 	},
		// 	sortable: false,
		// });
	} else {
		if (hasDelete || hasUpdate || hasView) {

			columns.push({
				name: <b>Acciones</b>,
				id: "actions",
				accessor: (str) => "actions",
				cell: (row, index) => (
					<div>
						{
							hasView && (
								<span onClick={() => handleView(row.id)}>
									<i
										className="fa fa-eye"
										style={{
											width: 35,
											fontSize: 20,
											padding: 11,
											color: "#e4566e",
										}}
									></i>
								</span>
							)

						}
						{
							hasUpdate && (
								<span onClick={() => handleUpdate(row)}>
									<i
										className="fa fa-pencil"
										style={{
											width: 35,
											fontSize: 20,
											padding: 11,
											color: "#e4566e",
										}}
									></i>
								</span>
							)
						}

						{
							hasDelete && (
								<span onClick={() => handleDelete(row.id)}>
									<i
										className="fa fa-trash"
										style={{
											width: 35,
											fontSize: 20,
											padding: 11,
											color: "#e4566e",
										}}
									></i>
								</span>
							)
						}


						{/* <span>
						<i
							onClick={onOpenModal}
							className="fa fa-pencil"
							style={{
								width: 35,
								fontSize: 20,
								padding: 11,
								color: "rgb(40, 167, 69)",
							}}
						></i>
						<Modal
							isOpen={open}
							toggle={onCloseModal}
							style={{ overlay: { opacity: 0.1 } }}
						>
							<ModalHeader toggle={onCloseModal}>
								<h5 className="modal-title f-w-600" id="exampleModalLabel2">
									Edit Product
								</h5>
							</ModalHeader>
							<ModalBody>
								<Form>
									<FormGroup>
										<Label htmlFor="recipient-name" className="col-form-label">
											Category Name :
										</Label>
										<Input type="text" className="form-control" />
									</FormGroup>
									<FormGroup>
										<Label htmlFor="message-text" className="col-form-label">
											Category Image :
										</Label>
										<Input
											className="form-control"
											id="validationCustom02"
											type="file"
										/>
									</FormGroup>
								</Form>
							</ModalBody>
							<ModalFooter>
								<Button
									type="button"
									color="primary"
									onClick={() => onCloseModal("VaryingMdo")}
								>
									Update
								</Button>
								<Button
									type="button"
									color="secondary"
									onClick={() => onCloseModal("VaryingMdo")}
								>
									Close
								</Button>
							</ModalFooter>
						</Modal>
					</span> */}
					</div>
				),
				style: {
					textAlign: "center",
				},
				sortable: false,
			});
		}
	}
	return (
		<div>
			<Fragment>
				<DataTable
					data={data}
					columns={columns}
					className={myClass}
					pagination={pagination}
					striped={true}
					center={true}
				/>

				<ToastContainer />
			</Fragment>
		</div>
	);
};

export default Datatable;
