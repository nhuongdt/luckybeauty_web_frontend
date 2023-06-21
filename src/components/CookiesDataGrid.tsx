import Cookies from 'js-cookie';

// Module hoặc class chịu trách nhiệm lưu và truy xuất cookies cho DataGrid
const DataGridCookieUtils = {
    saveSortActionsToCookie: (sortActions: any[]) => {
        Cookies.set('dataGridSortActions', JSON.stringify(sortActions));
    },

    getSortActionsFromCookie: (): any[] => {
        const sortActions = Cookies.get('dataGridSortActions');

        if (sortActions) {
            return JSON.parse(sortActions);
        }

        return [];
    }
};

export default DataGridCookieUtils;
