import './table.scss'
import {useEffect, useState} from "react";
import {getLocationsLocal} from "../services/location-service";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faPencil, faCheck, faSortUp, faSortDown} from "@fortawesome/free-solid-svg-icons";
import { useTranslation} from "react-i18next";
import {faTrashCan} from "@fortawesome/free-regular-svg-icons";
import store from "../store/store";
import * as actions from "../store/actionTypes";

interface Props {
    data: Array<any>
}
export function Table({data}: Props) {
    const [locationsPerPage, setLocationsPerPage] = useState(new Array<any>());
    const [editableArr, setEditableArr] = useState(new Array<any>());
    const [pages, setPages] = useState(new Array<any>());
    const [localLocations, setLocalLocations] = useState(new Array<any>());
    const [isNewItemAdded, setIsNewItemAdded] = useState(false);
    const [page, setPage] = useState(1);
    const [order, setOrder] = useState('ASC');
    let [itemsPerPage, setItemsPerPage] = useState(10);
    const { t, i18n } = useTranslation();
    let [isIncorrectLatitude, setIsIncorrectLatitude] = useState<{[index: number]: boolean}>({0: false});
    let [isIncorrectLongitude, setIsIncorrectLongitude] = useState<{[index: number]: boolean}>({0: false});
    const unsubscribe = store.subscribe(() => {
        console.log('store changed', store.getState())
    });
    useEffect(() => {
        setData(data);
        unsubscribe();
    }, []);
    function setData(locationsLocalStorage: Array<any>) {
        locationsLocalStorage = locationsLocalStorage.map((item, index) => {
            item['key'] = index;
            return item;
        });
        setLocalLocations(locationsLocalStorage);
        setEditableArr(new Array<any>(locationsLocalStorage.length).fill(false));
        calculatePagination(locationsLocalStorage)
    }
    function updateData(e: any, field: string, index: number, key: string, isArray?: boolean, arrayIndex?: number, fieldType?: string) {
        const prevArr = [...localLocations];
        let arrIndex: number;
        if (fieldType === 'lat' || fieldType === 'long') {
            if (fieldType === 'lat' && (e.target.value < -180 || e.target.value > 180)) {
                setIsIncorrectLatitude({[index]: true});
                return;
            } else {
                setIsIncorrectLatitude({[index]: false});
            }
            if (fieldType === 'long' && (e.target.value < -90 || e.target.value > 90)) {
                setIsIncorrectLongitude({[index]: true});
                return;
            } else {
                setIsIncorrectLongitude({[index]: false});
            }
        }
        arrayIndex ? arrIndex = arrayIndex : arrIndex = 0;
        !isArray ?
            prevArr[index][field] = e.target.value
            :
            prevArr[index][field][arrIndex] = e.target.value;
        setLocalLocations(prevArr);
    }
    function addNewItem() {
        store.dispatch({
            type: actions.LOCATION_ADD,
            payload: {
                localLocations,
                editableArr
            }
        });
        setIsNewItemAdded(true);
        editData(localLocations.length - 1, true);
        unsubscribe();
    }
    function removeNewItem() {
        store.dispatch({
            type: actions.LOCATION_DELETE,
            payload: {
                localLocations
            }
        });
        setIsNewItemAdded(false);
        unsubscribe();
    }
    function editData(index: number, isEdit: boolean) {
        const prevArr = [...editableArr];
        prevArr[index] = isEdit;
        setEditableArr(prevArr);
        store.dispatch({
            type: actions.LOCATION_EDIT,
            payload: {
                isEdit: isEdit,
                localLocations: localLocations
            }
        });
        if (!isEdit) {
            calculatePagination(localLocations);
            unsubscribe();
        }
    }
    function calculatePagination(localLocations: Array<any>) {
        const result = Math.ceil(localLocations.length / itemsPerPage);
        let arr: Array<number> = [];
        for (let i = 0; i<result; i++) {
            arr.push(i + 1);
        }
        setPages(arr);
        getPageResult(1, localLocations);
    }
    function getPageResult(selectedPage: number, locationsArray?: Array<any>) {
        let locations = locationsArray ? locationsArray : localLocations;
        setLocationsPerPage(locations.slice((selectedPage - 1) * itemsPerPage, selectedPage * itemsPerPage));
        setPage(selectedPage);
        if (selectedPage === pages.length) {
            setIsNewItemAdded(false);
        }
    }
    function sort(order: 'ASC'|'DSC') {
        store.dispatch({
            type: actions.LOCATION_SORT,
            payload: {
                localLocations,
                order
            }
        });
        const currentOrder = order === 'ASC' ? 'DSC' : 'ASC';
        setLocalLocations(localLocations);
        getPageResult(page);
        setOrder(currentOrder);
        unsubscribe();
    }
    function itemsOnPage(e: any) {
        itemsPerPage = e.target.value;
        setItemsPerPage(e.target.value);
        calculatePagination(localLocations);
    }
    return(
        <div className={'main-wrapper'}>
            <div className={'table-wrapper'}>
            <div className={'table-row'}>
                <div className={'table-col'}>{t('name')}
                    {
                        order === 'ASC' ?
                            <FontAwesomeIcon
                                className={'icon-sort'}
                                onClick={() => sort('ASC')}
                                icon={faSortUp} />
                            :
                            <FontAwesomeIcon
                                className={'icon-sort'}
                                onClick={() => sort('DSC')}
                                icon={faSortDown} />
                    }
                    </div>
                <div className={'table-col'}>{t('lat')}</div>
                <div className={'table-col'}>{t('long')}</div>
                <div className={'table-col last-column'}></div>
            </div>
            {
                locationsPerPage.map((location: {coordinates: Array<any>, name: string, key: string}, index) => (
                        <div key={index} className={'table-row'}>
                            <div className={'table-col'}>
                                <input
                                    key={index}
                                    value={location.name}
                                    disabled={!editableArr[index]}
                                    data-testid={'editable-input'+[index]}
                                    onChange={(e)=> {
                                        updateData(e, 'name', index, location.key)
                                    }}
                                />
                            </div>
                            <div className={'table-col warning-msg'}>
                                <input
                                    key={index}
                                    value={location.coordinates[0]}
                                    disabled={!editableArr[index]}
                                    onChange={(e)=> {
                                        updateData(e, 'coordinates', index, location.key, true, 0, 'lat')
                                    }}
                                />
                                { isIncorrectLatitude[index] ?
                                    <label>Incorrect latitude. Please, enter in diapason from -180 to 180</label>
                                    :
                                    <label></label>
                                }
                            </div>
                            <div className={'table-col warning-msg'}>
                                <input
                                    key={index}
                                    value={location.coordinates[1]}
                                    disabled={!editableArr[index]}
                                    onChange={(e)=> {
                                        updateData(e, 'coordinates', index, location.key, true, 1, 'long')
                                    }}
                                />
                                { isIncorrectLongitude[index] ?
                                    <label>Incorrect longitude. Please, enter diapason from -90 to 90</label>
                                    :
                                    <label></label>
                                }
                            </div>
                            {
                                !editableArr[index] ?
                                    <div className={'table-col last-column'}>
                                    <FontAwesomeIcon
                                        className={'icon-edit'}
                                        data-testid={'onedit-btn'+[index]}
                                        onClick={() => editData(index, true)}
                                        icon={faPencil} /></div>
                                    :
                                    <div className={'table-col last-column'}>
                                    <FontAwesomeIcon
                                        className={'icon-edit'}
                                        onClick={() => editData(index, false)}
                                        icon={faCheck} /></div>
                            }
                        </div>
                    ))
            }
            {
                isNewItemAdded ?
                    <div className={'table-row table-row-new'}>
                        <div className={'table-col'}>
                            <input
                                value={localLocations[localLocations.length - 1].name}
                                disabled={!editableArr[localLocations.length - 1]}
                                placeholder={'Location name'}
                                onChange={(e)=> {
                                    updateData(e, 'name', localLocations.length - 1, localLocations[localLocations.length - 1].key)
                                }}
                            />
                        </div>
                        <div className={'table-col warning-msg'}>
                            <input
                                value={localLocations[localLocations.length - 1].coordinates[0]}
                                disabled={!editableArr[localLocations.length - 1]}
                                type="number"
                                onChange={(e)=> {
                                    updateData(e, 'coordinates', localLocations.length - 1, localLocations[localLocations.length - 1].key, true, 0, 'lat')
                                }}
                            />
                            { isIncorrectLatitude[localLocations.length - 1] ?
                                <label>Incorrect latitude. Please, enter in diapason from -180 to 180</label>
                            :
                                <label></label>
                            }
                        </div>
                        <div className={'table-col warning-msg'}>
                            <input
                                value={localLocations[localLocations.length - 1].coordinates[1]}
                                disabled={!editableArr[localLocations.length - 1]}
                                onChange={(e)=> {
                                    updateData(e, 'coordinates', localLocations.length - 1, localLocations[localLocations.length - 1].key, true, 1, 'long')
                                }}
                            />
                            { isIncorrectLongitude[localLocations.length - 1] ?
                                <label>Incorrect longitude. Please, enter diapason from -90 to 90</label>
                            :
                                <label></label>
                            }
                        </div>
                        {
                            !editableArr[localLocations.length - 1] ?
                                <div className={'table-col last-column'}>
                                    <FontAwesomeIcon
                                        className={'icon-edit'}
                                        onClick={() => editData(localLocations.length - 1, true)}
                                        icon={faPencil} /></div>
                                :
                                <div className={'table-col last-column'}>
                                    <FontAwesomeIcon
                                        className={'icon-edit'}
                                        onClick={() => editData(localLocations.length - 1, false)}
                                        icon={faCheck} />
                                    <FontAwesomeIcon
                                        className={'icon-edit'}
                                        onClick={() => removeNewItem()}
                                        icon={faTrashCan}
                                    />
                                </div>
                        }
                    </div>
                    : ''
            }
            <div className={'action-buttons'}>
                <button
                    className={'btn-add'}
                    data-testid={'btn-add'}
                    onClick={addNewItem}
                >{t('add')}</button>
                <div className={'btn-items'}>
                    <select onChange={(e) => itemsOnPage(e)}>
                        <option value="10">10</option>
                        <option value="20">20</option>
                        <option value="30">30</option>
                    </select>
                </div>
            </div>

            <div className={'pagination'}>
                {pages.map((item, index) => (
                    <div key={index}
                         className={item !== page ? 'page' : 'page active'}
                            onClick={() => getPageResult(item)}>{item}</div>
                ))}
            </div>

        </div>
        </div>
    )
}
export default Table;