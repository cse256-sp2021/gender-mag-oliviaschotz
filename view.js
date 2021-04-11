// ---- Define your dialogs  and panels here ----
// let perm_panel = define_new_effective_permissions('perm-panel', true);
// $('#sidepanel').append(perm_panel);

// $('#perm-panel').attr('filepath', "/C/presentation_documents/important_file.txt");

// let user_select = define_new_user_select_field('select-panel', 'Select User', function(selected_user){
//     $('#perm-panel').attr('username', selected_user);
// });
// $('#sidepanel').append(user_select);

// info_dialog = define_new_dialog('info-dialog', 'Info Dialog', {});
// $('#sidepanel').append(info_dialog);

// $('.perm_info').click(function(){
//     console.log("perm info clicked!");
//     info_dialog.dialog('open');

//     let filepath = $('#perm-panel').attr('filepath');
//     let current_user = $('#perm-panel').attr('username');
//     let permission = $(this).attr('permission_name');
    
//     let explanation_text = get_explanation_text(allow_user_action(path_to_file[filepath], all_users[current_user], permission, true));
    
//     info_dialog.text(explanation_text);
// });

// let info_panel = define_new

let info_panel = define_new_dialog('info-dialog', 'Help', {});
$("#sidepanel").append(info_panel);
info_panel.append(`<h3>Help</h3>`)
info_panel.append(`<p><br>Click the lock icon to open the list of permissions for the corresponding file/folder`);
info_panel.append(`<br>Click "Advanced" to see the inherited permissions`);
info_panel.append(`<br><br>To restrict permissions of a user who is part of a group that has been added, add that user to the file and deny the permissions you would like to restrict.</p>`);



// ---- Display file structure ----

// (recursively) makes and returns an html element (wrapped in a jquery object) for a given file object
function make_file_element(file_obj) {
    let file_hash = get_full_path(file_obj)

    if(file_obj.is_folder) {
        let folder_elem = $(`<div class='folder' id="${file_hash}_div">
            <h3 id="${file_hash}_header">
                <span class="oi oi-folder" id="${file_hash}_icon"/> ${file_obj.filename} 
                <button class="ui-button ui-widget ui-corner-all permbutton" path="${file_hash}" id="${file_hash}_permbutton"> 
                    <span class="oi oi-lock-unlocked" id="${file_hash}_permicon"/> 
                </button>
            </h3>
        </div>`)

        // append children, if any:
        if( file_hash in parent_to_children) {
            let container_elem = $("<div class='folder_contents'></div>")
            folder_elem.append(container_elem)
            for(child_file of parent_to_children[file_hash]) {
                let child_elem = make_file_element(child_file)
                container_elem.append(child_elem)
            }
        }
        return folder_elem
    }
    else {
        return $(`<div class='file'  id="${file_hash}_div">
            <span class="oi oi-file" id="${file_hash}_icon"/> ${file_obj.filename}
            <button class="ui-button ui-widget ui-corner-all permbutton" path="${file_hash}" id="${file_hash}_permbutton"> 
                <span class="oi oi-lock-unlocked" id="${file_hash}_permicon"/> 
            </button>
        </div>`)
    }
}

for(let root_file of root_files) {
    let file_elem = make_file_element(root_file)
    $( "#filestructure" ).append( file_elem);    
}



// make folder hierarchy into an accordion structure
$('.folder').accordion({
    collapsible: true,
    heightStyle: 'content'
}) // TODO: start collapsed and check whether read permission exists before expanding?


// -- Connect File Structure lock buttons to the permission dialog --

// open permissions dialog when a permission button is clicked
$('.permbutton').click( function( e ) {
    // Set the path and open dialog:
    let path = e.currentTarget.getAttribute('path');
    perm_dialog.attr('filepath', path)
    perm_dialog.dialog('open')
    //open_permissions_dialog(path)

    // Deal with the fact that folders try to collapse/expand when you click on their permissions button:
    e.stopPropagation() // don't propagate button click to element underneath it (e.g. folder accordion)
    // Emit a click for logging purposes:
    emitter.dispatchEvent(new CustomEvent('userEvent', { detail: new ClickEntry(ActionEnum.CLICK, (e.clientX + window.pageXOffset), (e.clientY + window.pageYOffset), e.target.id,new Date().getTime()) }))
});


// ---- Assign unique ids to everything that doesn't have an ID ----
$('#html-loc').find('*').uniqueId() 