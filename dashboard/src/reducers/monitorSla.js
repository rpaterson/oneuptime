import * as types from '../constants/monitorSla';

const initialState = {
    monitorSla: {
        requesting: false,
        success: false,
        error: null,
        sla: [],
    },
    monitorSlas: {
        requesting: false,
        success: false,
        error: null,
        slas: [],
        count: 0,
        skip: 0,
        limit: 10,
    },
    activeSla: '',
};

export default function monitorSla(state = initialState, action) {
    switch (action.type) {
        case types.CREATE_MONITOR_SLA_REQUEST:
            return {
                ...state,
                monitorSla: {
                    ...state.monitorSla,
                    requesting: true,
                    success: false,
                    error: null,
                },
            };

        case types.CREATE_MONITOR_SLA_SUCCESS:
            return {
                ...state,
                monitorSla: {
                    requesting: false,
                    success: true,
                    error: null,
                    sla: action.payload,
                },
            };

        case types.CREATE_MONITOR_SLA_FAILURE:
            return {
                ...state,
                monitorSla: {
                    ...state.monitorSla,
                    requesting: false,
                    success: false,
                    error: action.payload,
                },
            };

        case types.DELETE_MONITOR_SLA_REQUEST:
            return {
                ...state,
                monitorSlas: {
                    ...state.monitorSlas,
                    requesting: true,
                    success: false,
                    error: null,
                },
            };

        case types.DELETE_MONITOR_SLA_SUCCESS: {
            const slas = state.monitorSlas.slas.filter(
                sla => String(sla._id) !== String(action.payload._id)
            );
            return {
                ...state,
                monitorSlas: {
                    ...state.monitorSlas,
                    requesting: false,
                    success: true,
                    error: null,
                    slas,
                    count: state.monitorSlas.count - 1,
                },
            };
        }

        case types.DELETE_MONITOR_SLA_FAILURE:
            return {
                ...state,
                monitorSlas: {
                    ...state.monitorSlas,
                    requesting: false,
                    success: false,
                    error: action.payload,
                },
            };

        case types.FETCH_MONITOR_SLAS_REQUEST:
            return {
                ...state,
                monitorSlas: {
                    ...state.monitorSlas,
                    requesting: true,
                    success: false,
                    error: null,
                },
            };

        case types.FETCH_MONITOR_SLAS_SUCCESS:
            return {
                ...state,
                monitorSlas: {
                    requesting: false,
                    success: true,
                    error: null,
                    slas: action.payload.data,
                    count: action.payload.count,
                    limit: action.payload.limit,
                    skip: action.payload.skip,
                },
            };

        case types.FETCH_MONITOR_SLAS_FAILURE:
            return {
                ...state,
                monitorSlas: {
                    ...state.monitorSlas,
                    requesting: false,
                    success: false,
                    error: action.payload,
                },
            };

        case types.UPDATE_MONITOR_SLA_REQUEST:
            return {
                ...state,
                monitorSlas: {
                    ...state.monitorSlas,
                    requesting: true,
                    success: false,
                    error: null,
                },
            };

        case types.UPDATE_MONITOR_SLA_SUCCESS: {
            const slas = state.monitorSlas.slas.map(sla => {
                if (
                    action.payload.isDefault &&
                    String(sla._id) !== String(action.payload._id)
                ) {
                    sla.isDefault = false;
                }

                if (String(sla._id) === String(action.payload._id)) {
                    sla = action.payload;
                }

                return sla;
            });
            return {
                ...state,
                monitorSlas: {
                    ...state.monitorSlas,
                    requesting: false,
                    success: true,
                    error: null,
                    slas,
                },
            };
        }

        case types.UPDATE_MONITOR_SLA_FAILURE:
            return {
                ...state,
                monitorSlas: {
                    ...state.monitorSlas,
                    requesting: false,
                    success: false,
                    error: action.payload,
                },
            };

        case types.SET_ACTIVE_MONITOR_SLA:
            return {
                ...state,
                activeSla: action.payload,
            };

        default:
            return state;
    }
}
