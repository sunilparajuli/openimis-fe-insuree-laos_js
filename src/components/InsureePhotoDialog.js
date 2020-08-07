import React, { Component } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { injectIntl } from 'react-intl';
import { withTheme, withStyles } from "@material-ui/core/styles";
import FileIcon from "@material-ui/icons/ImageSearch";
import {
    Dialog, DialogTitle, Divider, Button, Grid,
    DialogActions, DialogContent, IconButton
} from "@material-ui/core";
import {
    FormattedMessage, withModulesManager, ProgressOrError, Table, TextInput,
    PublishedComponent,
    formatMessage, formatMessageWithValues,
    journalize, coreConfirm
} from "@openimis/fe-core";
import { insureeLabel } from "../utils/utils";
import { setInsureePhoto } from "../actions";
import { RIGHT_INSUREE_EDIT } from "../constants";

const styles = theme => ({
    dialogTitle: theme.dialog.title,
    dialogContent: theme.dialog.content,
    item: theme.paper.item,
});


class InsureePhotoDialog extends Component {

    onClose = () => !!this.props.close && this.props.close()


    setInsureePhoto = (filename, photo) => {
        //TODO
    }

    fileSelected = (f) => {
        if (!!f.target.files) {
            const file = f.target.files[0];
            var reader = new FileReader();
            reader.onloadend = loaded => {
                this.setInsureePhoto(
                    `${file.name}.${file.type}`,
                    btoa(loaded.target.result)
                )
            }
            reader.readAsBinaryString(file);
        }
    }

    render() {
        const {
            intl, classes, insuree, readOnly = false, open
        } = this.props;
        if (!insuree) return null;
        return (
            <Dialog
                open={open}
                fullWidth={true}
                maxWidth="md"
            >
                <DialogTitle className={classes.dialogTitle}>
                    <FormattedMessage module="insuree" id="InsureePhotoDialog.title" values={{ 'label': insureeLabel(insuree) }} />
                </DialogTitle>
                <Divider />
                <DialogContent className={classes.dialogContent}>
                    <Grid container>
                        <Grid item xs={2} className={classes.item} >
                            <PublishedComponent pubRef="core.DatePicker"
                                value={!!insuree && !!insuree.photo ? insuree.photo.date : null}
                                module="insuree"
                                label="Insuree.photoDate"
                                readOnly={readOnly}
                                required={true}
                                onChange={v => this.updateAttribute('dob', v)}
                            />
                        </Grid>
                        <Grid item xs={4} className={classes.item} >
                            <PublishedComponent pubRef="insuree.InsureeOfficerPicker"
                                value={!!insuree && !!insuree.photo ? insuree.photo.officerId : null}
                                module="insuree"
                                label={formatMessage(intl, "insuree", "Insuree.photoOfficer")}
                                readOnly={readOnly}
                                required={true}
                                onChange={v => this.updateAttribute('dob', v)}
                            />
                        </Grid>
                        <Grid item xs={5} className={classes.item} >
                            <TextInput
                                module="insuree"
                                label="Insuree.photoFilename"
                                required={true}
                                readOnly={readOnly}
                                value={!!insuree && !!insuree.photo ? insuree.photo.filename : ""}
                            />
                        </Grid>
                        <Grid item xs={1} className={classes.item} >
                            <IconButton
                                variant="contained"
                                component="label"
                            >
                                <FileIcon />
                                <input
                                    type="file"
                                    style={{ display: "none" }}
                                    onChange={f => this.fileSelected(f)}
                                />
                            </IconButton>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.onClose} color="primary">
                        <FormattedMessage module="insuree" id="close" />
                    </Button>
                </DialogActions>
            </Dialog>
        )
    }
}

export default withModulesManager(
    injectIntl(withTheme(withStyles(styles)(InsureePhotoDialog))));