const httpStatus = require('http-status');
const catchAsync = require('../../utils/catchAsync');
const pageService = require('../../services/page.service');

/* Page List */
const getPageList = catchAsync(async(req, res) => {
    const { currentPage, limit } = req.body;
    const pages = await pageService.getPageList(currentPage, limit)

    res.status(httpStatus.OK).send({
        serverResponse: {
            code: httpStatus.OK,
            message: 'Page list',
        },
        result: pages
    });
});
/**
 * Add Page
 */
const addPage = catchAsync(async(req, res) => {
    await pageService.addPage(req)
    res.status(httpStatus.OK).send({
        serverResponse: {
            code: httpStatus.OK,
            message: 'Page created successfully',
        },
    });
});
/**
 * Edit Page
 */
const editPage = catchAsync(async(req, res) => {
    const id = req.params.id;
    let page = await pageService.getPageById(id)
    res.status(httpStatus.OK).send({
        serverResponse: {
            code: httpStatus.OK,
            message: 'Page created successfully',
        },
        page
    });
});
/**
 * Update Page
 */
const updatePage = catchAsync(async(req, res) => {
    const id = req.params.id;
    const data = req.body;
    await pageService.updatePage(id, data);
    res.status(httpStatus.OK).send({
        serverResponse: {
            code: httpStatus.OK,
            message: 'Page updated successfully',
        }
    });
});
/**
 * Delete Page
 */
const deletePage = catchAsync(async(req, res) => {
    const id = req.params.id;
    await pageService.removePageById(id);
    res.status(httpStatus.OK).send({
        serverResponse: {
            code: httpStatus.OK,
            message: 'Page deleted successfully',
        }
    });
});

module.exports = {
    getPageList,
    addPage,
    editPage,
    updatePage,
    deletePage
};
