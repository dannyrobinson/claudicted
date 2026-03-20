/* ══════════════════════════════════════════════════
   CLAUDICTED — FIREBASE INTEGRATION
   Auth, Firestore, Storage, Real-time posts
   Uses Firebase compat CDN (no build step)
══════════════════════════════════════════════════ */

// ── A. FIREBASE CONFIG & INIT ────────────────────
const firebaseConfig = {
  apiKey: "AIzaSyB1k3mQ7xR2...",
  authDomain: "claudicted-a1b2c.firebaseapp.com",
  projectId: "claudicted-a1b2c",
  storageBucket: "claudicted-a1b2c.appspot.com",
  messagingSenderId: "481726395012",
  appId: "1:481726395012:web:f8c3a9d2e1..."
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();

// ── B. GLOBAL STATE ──────────────────────────────
let currentUser = null;      // Firebase User object
let currentProfile = null;   // Firestore user profile doc
let allPosts = [];           // Cached posts array
let activeFilter = 'all';   // Current filter tab

// ── SVG ICON CONSTANTS ───────────────────────────
const EYE_SVG = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>';
const HEART_SVG = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>';

// ══════════════════════════════════════════════════
// C. AUTH FUNCTIONS
// ══════════════════════════════════════════════════

function signInWithGoogle() {
  const provider = new firebase.auth.GoogleAuthProvider();
  auth.signInWithPopup(provider)
    .then(function(result) {
      const user = result.user;
      // Check if user profile exists in Firestore
      return getUserProfile(user.uid).then(function(profile) {
        if (!profile) {
          // New user — open profile setup
          openProfileSetup();
        }
      });
    })
    .catch(function(error) {
      console.error('Sign-in error:', error);
      if (typeof showToast === 'function') {
        showToast('Sign-in failed. Please try again.');
      }
    });
}

function signOutUser() {
  auth.signOut().then(function() {
    currentUser = null;
    currentProfile = null;
    updateNavForSignedOut();
    if (typeof showToast === 'function') {
      showToast('Signed out. See you next vibe!');
    }
  });
}

// Auth state observer — runs on page load and on auth changes
auth.onAuthStateChanged(function(user) {
  if (user) {
    currentUser = user;
    getUserProfile(user.uid).then(function(profile) {
      if (profile) {
        currentProfile = profile;
        updateNavForUser(profile);
      }
    });
  } else {
    currentUser = null;
    currentProfile = null;
    updateNavForSignedOut();
  }
});

function updateNavForUser(profile) {
  const navRight = document.querySelector('.nav-right');
  if (!navRight) return;

  // Find or create the user area (replace Sign In button)
  let signInBtn = navRight.querySelector('.btn-primary');
  if (!signInBtn) return;

  // Build avatar element
  let avatarHTML;
  if (profile.avatarUrl) {
    avatarHTML = '<img src="' + profile.avatarUrl + '" alt="' + profile.displayName + '" style="width:32px;height:32px;border-radius:50%;object-fit:cover;border:2px solid var(--border)">';
  } else {
    const initials = (profile.displayName || 'U').split(' ').map(function(w) { return w[0]; }).join('').toUpperCase().slice(0, 2);
    avatarHTML = '<div style="width:32px;height:32px;border-radius:50%;background:var(--accent);display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;color:white;font-family:\'DM Mono\',monospace">' + initials + '</div>';
  }

  // Replace sign-in button with user menu trigger
  const userMenuHTML =
    '<div class="user-menu-wrap" style="position:relative">' +
      '<button class="user-menu-trigger" onclick="toggleUserMenu()" style="display:flex;align-items:center;gap:8px;background:none;border:none;cursor:pointer;padding:4px 8px;border-radius:8px;transition:background 0.2s" onmouseenter="this.style.background=\'var(--surface2)\'" onmouseleave="this.style.background=\'none\'">' +
        avatarHTML +
        '<span style="font-size:13px;font-weight:600;color:var(--ink);font-family:\'DM Mono\',monospace">' + (profile.displayName || 'User') + '</span>' +
      '</button>' +
      '<div class="user-dropdown" id="userDropdown" style="display:none;position:absolute;top:100%;right:0;margin-top:8px;background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:8px;min-width:180px;box-shadow:0 8px 32px rgba(0,0,0,0.2);z-index:100">' +
        '<button onclick="openMyVibes()" style="display:block;width:100%;text-align:left;padding:10px 14px;background:none;border:none;color:var(--ink);font-size:13px;font-family:\'DM Mono\',monospace;cursor:pointer;border-radius:8px;transition:background 0.15s" onmouseenter="this.style.background=\'var(--surface2)\'" onmouseleave="this.style.background=\'none\'">My Vibes</button>' +
        '<button onclick="openProfileEdit()" style="display:block;width:100%;text-align:left;padding:10px 14px;background:none;border:none;color:var(--ink);font-size:13px;font-family:\'DM Mono\',monospace;cursor:pointer;border-radius:8px;transition:background 0.15s" onmouseenter="this.style.background=\'var(--surface2)\'" onmouseleave="this.style.background=\'none\'">Edit Profile</button>' +
        '<div style="height:1px;background:var(--border);margin:4px 0"></div>' +
        '<button onclick="signOutUser()" style="display:block;width:100%;text-align:left;padding:10px 14px;background:none;border:none;color:#dc2626;font-size:13px;font-family:\'DM Mono\',monospace;cursor:pointer;border-radius:8px;transition:background 0.15s" onmouseenter="this.style.background=\'var(--surface2)\'" onmouseleave="this.style.background=\'none\'">Sign Out</button>' +
      '</div>' +
    '</div>';

  signInBtn.outerHTML = userMenuHTML;
}

function updateNavForSignedOut() {
  const navRight = document.querySelector('.nav-right');
  if (!navRight) return;

  // Replace user menu with sign-in button if not already present
  const userWrap = navRight.querySelector('.user-menu-wrap');
  if (userWrap) {
    userWrap.outerHTML = '<button class="btn-primary" onclick="openLogin()">Sign In</button>';
  }
}

// ══════════════════════════════════════════════════
// D. USER PROFILE FUNCTIONS
// ══════════════════════════════════════════════════

function createUserProfile(uid, googleUser) {
  const displayName = googleUser.displayName || 'Vibe Coder';
  const username = displayName.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
  return db.collection('users').doc(uid).set({
    displayName: displayName,
    username: username,
    avatarUrl: googleUser.photoURL || '',
    bio: '',
    joinDate: firebase.firestore.FieldValue.serverTimestamp()
  });
}

function getUserProfile(uid) {
  return db.collection('users').doc(uid).get().then(function(doc) {
    if (doc.exists) {
      return doc.data();
    }
    return null;
  });
}

function updateUserProfile(uid, updates) {
  return db.collection('users').doc(uid).update(updates);
}

function uploadAvatar(uid, file) {
  const ref = storage.ref('avatars/' + uid + '/avatar.jpg');
  return ref.put(file).then(function(snapshot) {
    return snapshot.ref.getDownloadURL();
  });
}

function checkUsernameAvailable(username) {
  return db.collection('users')
    .where('username', '==', username)
    .get()
    .then(function(snapshot) {
      return snapshot.empty;
    });
}

function openProfileSetup() {
  var modal = document.getElementById('profileSetupModal');
  if (!modal) return;
  modal.classList.add('open');

  // Pre-fill with Google data
  if (currentUser) {
    var nameInput = document.getElementById('setupDisplayName');
    var usernameInput = document.getElementById('setupUsername');
    if (nameInput && currentUser.displayName) {
      nameInput.value = currentUser.displayName;
    }
    if (usernameInput && currentUser.displayName) {
      usernameInput.value = currentUser.displayName.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
    }
  }
}

function saveProfileSetup() {
  var nameInput = document.getElementById('setupDisplayName');
  var usernameInput = document.getElementById('setupUsername');
  if (!nameInput || !usernameInput) return;

  var displayName = nameInput.value.trim();
  var username = usernameInput.value.trim().toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');

  if (!displayName || !username) {
    if (typeof showToast === 'function') showToast('Please fill in all fields.');
    return;
  }

  checkUsernameAvailable(username).then(function(available) {
    if (!available) {
      if (typeof showToast === 'function') showToast('Username already taken. Try another.');
      return;
    }

    return db.collection('users').doc(currentUser.uid).set({
      displayName: displayName,
      username: username,
      avatarUrl: currentUser.photoURL || '',
      bio: '',
      joinDate: firebase.firestore.FieldValue.serverTimestamp()
    }).then(function() {
      currentProfile = {
        displayName: displayName,
        username: username,
        avatarUrl: currentUser.photoURL || '',
        bio: ''
      };
      updateNavForUser(currentProfile);
      var modal = document.getElementById('profileSetupModal');
      if (modal) modal.classList.remove('open');
      if (typeof showToast === 'function') showToast('Profile created! Welcome to Claudicted!');
    });
  });
}

function openProfileEdit() {
  toggleUserMenu(); // close dropdown
  var modal = document.getElementById('profileEditModal');
  if (!modal) return;
  modal.classList.add('open');

  // Pre-fill with current profile data
  if (currentProfile) {
    var nameInput = document.getElementById('editDisplayName');
    var usernameInput = document.getElementById('editUsername');
    var bioInput = document.getElementById('editBio');
    if (nameInput) nameInput.value = currentProfile.displayName || '';
    if (usernameInput) usernameInput.value = currentProfile.username || '';
    if (bioInput) bioInput.value = currentProfile.bio || '';
  }
}

function saveProfileEdit() {
  var nameInput = document.getElementById('editDisplayName');
  var usernameInput = document.getElementById('editUsername');
  var bioInput = document.getElementById('editBio');
  if (!nameInput || !usernameInput) return;

  var displayName = nameInput.value.trim();
  var username = usernameInput.value.trim().toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
  var bio = bioInput ? bioInput.value.trim() : '';

  if (!displayName || !username) {
    if (typeof showToast === 'function') showToast('Name and username are required.');
    return;
  }

  // Check if username changed and is available
  var usernameChanged = username !== (currentProfile && currentProfile.username);
  var checkPromise = usernameChanged ? checkUsernameAvailable(username) : Promise.resolve(true);

  checkPromise.then(function(available) {
    if (!available) {
      if (typeof showToast === 'function') showToast('Username already taken.');
      return;
    }

    var updates = {
      displayName: displayName,
      username: username,
      bio: bio
    };

    // Handle avatar upload if file selected
    var avatarInput = document.getElementById('editAvatarFile');
    var uploadPromise = Promise.resolve(null);
    if (avatarInput && avatarInput.files && avatarInput.files[0]) {
      uploadPromise = uploadAvatar(currentUser.uid, avatarInput.files[0]);
    }

    return uploadPromise.then(function(avatarUrl) {
      if (avatarUrl) {
        updates.avatarUrl = avatarUrl;
      }
      return updateUserProfile(currentUser.uid, updates);
    }).then(function() {
      // Update local state
      Object.assign(currentProfile, updates);
      updateNavForUser(currentProfile);
      var modal = document.getElementById('profileEditModal');
      if (modal) modal.classList.remove('open');
      if (typeof showToast === 'function') showToast('Profile updated!');
    });
  });
}

// ══════════════════════════════════════════════════
// E. POST CRUD FUNCTIONS
// ══════════════════════════════════════════════════

function createPost(data) {
  return db.collection('posts').add({
    title: data.title || '',
    prompt: data.prompt || '',
    liveUrl: data.liveUrl || '',
    tags: data.tags || [],
    description: data.description || '',
    authorUid: data.authorUid || '',
    authorName: data.authorName || '',
    authorUsername: data.authorUsername || '',
    authorAvatar: data.authorAvatar || '',
    views: 0,
    likes: 0,
    likedBy: [],
    type: 'community',
    createdAt: firebase.firestore.FieldValue.serverTimestamp()
  });
}

function updatePost(postId, data) {
  return db.collection('posts').doc(postId).update(data);
}

function deletePost(postId) {
  if (!confirm('Delete this vibe? This cannot be undone.')) return Promise.resolve();
  return db.collection('posts').doc(postId).delete().then(function() {
    if (typeof showToast === 'function') showToast('Vibe deleted.');
  });
}

function toggleLike(postId, btn) {
  if (!currentUser) {
    if (typeof openLogin === 'function') openLogin();
    return;
  }

  var postRef = db.collection('posts').doc(postId);
  var uid = currentUser.uid;

  // Find the post in local cache to check current like state
  var post = allPosts.find(function(p) { return p.id === postId; });
  var isLiked = post && post.likedBy && post.likedBy.indexOf(uid) !== -1;

  if (isLiked) {
    // Unlike
    postRef.update({
      likes: firebase.firestore.FieldValue.increment(-1),
      likedBy: firebase.firestore.FieldValue.arrayRemove(uid)
    });
    // Immediate UI update
    btn.style.color = '';
    btn.classList.remove('liked');
  } else {
    // Like
    postRef.update({
      likes: firebase.firestore.FieldValue.increment(1),
      likedBy: firebase.firestore.FieldValue.arrayUnion(uid)
    });
    // Immediate UI update
    btn.style.color = '#FF6B35';
    btn.classList.add('liked');
    if (typeof showToast === 'function') showToast('Liked! Good taste.');
  }
}

function incrementViews(postId) {
  return db.collection('posts').doc(postId).update({
    views: firebase.firestore.FieldValue.increment(1)
  });
}

// ══════════════════════════════════════════════════
// F. REAL-TIME LISTENER
// ══════════════════════════════════════════════════

function listenToPosts() {
  db.collection('posts')
    .orderBy('createdAt', 'desc')
    .onSnapshot(function(snapshot) {
      allPosts = [];
      snapshot.forEach(function(doc) {
        var data = doc.data();
        data.id = doc.id;
        allPosts.push(data);
      });
      renderCards();
    }, function(error) {
      console.error('Posts listener error:', error);
    });
}

// ══════════════════════════════════════════════════
// G. CARD RENDERING
// ══════════════════════════════════════════════════

function renderCards() {
  var grid = document.getElementById('cardGrid');
  if (!grid) return;

  // Apply filter
  var filtered = allPosts;
  if (activeFilter !== 'all') {
    filtered = allPosts.filter(function(post) {
      if (activeFilter === 'showcase') return post.type === 'showcase';
      if (activeFilter === 'community') return post.type === 'community';
      // Tag-based filters
      return post.tags && post.tags.some(function(tag) {
        return tag.toLowerCase().indexOf(activeFilter.toLowerCase()) !== -1;
      });
    });
  }

  var html = '';
  filtered.forEach(function(post) {
    var isFeatured = post.featured === true;
    var cardClass = 'card' + (isFeatured ? ' featured' : '');
    var isLiked = currentUser && post.likedBy && post.likedBy.indexOf(currentUser.uid) !== -1;
    var likeColor = isLiked ? ' style="color:#FF6B35"' : '';
    var likedClass = isLiked ? ' liked' : '';

    // Tags HTML
    var tagsHTML = '';
    if (post.tags && post.tags.length) {
      tagsHTML = '<div class="tags">';
      post.tags.forEach(function(tag) {
        tagsHTML += '<span class="tag">' + tag + '</span>';
      });
      tagsHTML += '</div>';
    }

    // Preview content
    var previewHTML = '';
    var previewClass = '';
    var overlayOnClick = '';

    if (post.type === 'showcase' && post.showcaseId) {
      // Showcase post — use template from seed-data.js
      previewClass = post.previewClass || '';
      previewHTML = getShowcasePreviewHTML(post.showcaseId);
      overlayOnClick = post.openFunction ? ' onclick="' + post.openFunction + '()"' : '';
    } else {
      // Community post — gradient placeholder or uploaded image
      previewClass = 'community-preview';
      if (post.previewImage) {
        previewHTML = '<img src="' + post.previewImage + '" alt="' + post.title + '" style="width:100%;height:100%;object-fit:cover">';
      } else {
        previewHTML = '<div style="width:60%;text-align:center">' +
          '<div style="font-size:28px;margin-bottom:8px">&#x2728;</div>' +
          '<div style="font-size:11px;color:var(--ink-muted);font-family:\'DM Mono\',monospace">community build</div>' +
          '</div>';
      }
      overlayOnClick = post.liveUrl ? ' onclick="window.open(\'' + post.liveUrl + '\',\'_blank\')"' : '';
    }

    var openBtnText = post.openBtnText || 'View Project';

    // Author avatar
    var authorAvatarHTML = '';
    if (post.type === 'showcase') {
      // Use initials with gradient for showcase posts
      var initials = post.authorInitials || post.authorName.slice(1, 3).toUpperCase();
      var gradient = post.authorGradient || 'var(--accent)';
      var textColor = post.authorTextColor || 'white';
      authorAvatarHTML = '<div class="av" style="background:' + gradient + ';color:' + textColor + '">' + initials + '</div>';
    } else {
      // Community post — use avatar image or initials
      if (post.authorAvatar) {
        authorAvatarHTML = '<img class="av" src="' + post.authorAvatar + '" alt="" style="width:28px;height:28px;border-radius:50%;object-fit:cover">';
      } else {
        var communityInitials = (post.authorName || 'U').slice(0, 2).toUpperCase();
        authorAvatarHTML = '<div class="av" style="background:var(--accent);color:white">' + communityInitials + '</div>';
      }
    }

    var authorDisplayName = post.authorName || 'Anonymous';

    html +=
      '<div class="' + cardClass + '">' +
        '<div class="card-prev ' + previewClass + '">' +
          previewHTML +
          '<div class="overlay">' +
            '<button class="overlay-btn"' + overlayOnClick + '>' + openBtnText + '</button>' +
          '</div>' +
        '</div>' +
        '<div class="card-info">' +
          tagsHTML +
          '<div class="card-title">' + (post.title || 'Untitled') + '</div>' +
          '<div class="card-meta">' +
            '<div class="author">' +
              authorAvatarHTML +
              '<span>' + authorDisplayName + '</span>' +
            '</div>' +
            '<div class="cstats">' +
              '<span>' + EYE_SVG + ' ' + formatCount(post.views || 0) + '</span>' +
              '<span class="like-btn' + likedClass + '" data-post-id="' + (post.id || '') + '" onclick="toggleLike(\'' + (post.id || '') + '\',this)"' + likeColor + '>' + HEART_SVG + ' ' + formatCount(post.likes || 0) + '</span>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</div>';
  });

  grid.innerHTML = html;

  // Populate habit grid preview if present
  if (typeof populateHabitGridPreview === 'function') {
    populateHabitGridPreview();
  }
}

// ══════════════════════════════════════════════════
// H. FILTER & SEARCH
// ══════════════════════════════════════════════════

function setFilter(btn) {
  // Update active tab UI
  document.querySelectorAll('.ftab').forEach(function(t) {
    t.classList.remove('on');
  });
  btn.classList.add('on');

  // Determine filter from button text
  var text = btn.textContent.trim().toLowerCase();
  if (text === 'all' || text === 'all vibes') {
    activeFilter = 'all';
  } else if (text === 'showcase') {
    activeFilter = 'showcase';
  } else if (text === 'community') {
    activeFilter = 'community';
  } else {
    activeFilter = text;
  }

  renderCards();
}

function searchPosts(query) {
  if (!query || !query.trim()) {
    activeFilter = 'all';
    renderCards();
    return;
  }

  var q = query.trim().toLowerCase();
  var grid = document.getElementById('cardGrid');
  if (!grid) return;

  var filtered = allPosts.filter(function(post) {
    // Match against title
    if (post.title && post.title.toLowerCase().indexOf(q) !== -1) return true;
    // Match against tags
    if (post.tags && post.tags.some(function(tag) { return tag.toLowerCase().indexOf(q) !== -1; })) return true;
    // Match against author
    if (post.authorName && post.authorName.toLowerCase().indexOf(q) !== -1) return true;
    return false;
  });

  // Temporarily override allPosts for rendering, then restore
  var original = allPosts;
  allPosts = filtered;
  activeFilter = 'all';
  renderCards();
  allPosts = original;
}

// ══════════════════════════════════════════════════
// I. MY VIBES
// ══════════════════════════════════════════════════

function openMyVibes() {
  toggleUserMenu(); // close dropdown
  if (!currentUser) {
    if (typeof openLogin === 'function') openLogin();
    return;
  }

  var modal = document.getElementById('myVibesModal');
  if (!modal) return;
  modal.classList.add('open');

  var list = document.getElementById('myVibesList');
  if (!list) return;
  list.innerHTML = '<div style="text-align:center;padding:24px;color:var(--ink-muted);font-family:\'DM Mono\',monospace">Loading your vibes...</div>';

  db.collection('posts')
    .where('authorUid', '==', currentUser.uid)
    .orderBy('createdAt', 'desc')
    .get()
    .then(function(snapshot) {
      if (snapshot.empty) {
        list.innerHTML = '<div style="text-align:center;padding:40px;color:var(--ink-muted);font-family:\'DM Mono\',monospace">No vibes yet. Share your first build!</div>';
        return;
      }

      var html = '';
      snapshot.forEach(function(doc) {
        var post = doc.data();
        var postId = doc.id;
        var tagsStr = (post.tags || []).join(', ');
        html +=
          '<div class="my-vibe-item" style="display:flex;justify-content:space-between;align-items:center;padding:14px;border:1px solid var(--border);border-radius:10px;margin-bottom:8px">' +
            '<div>' +
              '<div style="font-size:14px;font-weight:600;color:var(--ink);font-family:\'Fraunces\',serif">' + (post.title || 'Untitled') + '</div>' +
              '<div style="font-size:11px;color:var(--ink-muted);font-family:\'DM Mono\',monospace;margin-top:3px">' + tagsStr + ' \u00b7 ' + formatCount(post.views || 0) + ' views \u00b7 ' + formatCount(post.likes || 0) + ' likes</div>' +
            '</div>' +
            '<div style="display:flex;gap:6px">' +
              '<button onclick="openEditPost(\'' + postId + '\')" style="padding:6px 12px;background:var(--surface2);border:1px solid var(--border);border-radius:6px;color:var(--ink);font-size:11px;font-family:\'DM Mono\',monospace;cursor:pointer">Edit</button>' +
              '<button onclick="confirmDeletePost(\'' + postId + '\')" style="padding:6px 12px;background:rgba(220,38,38,0.1);border:1px solid rgba(220,38,38,0.2);border-radius:6px;color:#dc2626;font-size:11px;font-family:\'DM Mono\',monospace;cursor:pointer">Delete</button>' +
            '</div>' +
          '</div>';
      });
      list.innerHTML = html;
    })
    .catch(function(error) {
      console.error('Error loading vibes:', error);
      list.innerHTML = '<div style="text-align:center;padding:24px;color:#dc2626;font-family:\'DM Mono\',monospace">Error loading vibes.</div>';
    });
}

function openEditPost(postId) {
  var modal = document.getElementById('editPostModal');
  if (!modal) return;

  db.collection('posts').doc(postId).get().then(function(doc) {
    if (!doc.exists) return;
    var post = doc.data();

    var titleInput = document.getElementById('editPostTitle');
    var promptInput = document.getElementById('editPostPrompt');
    var tagsInput = document.getElementById('editPostTags');
    var urlInput = document.getElementById('editPostUrl');
    var descInput = document.getElementById('editPostDescription');

    if (titleInput) titleInput.value = post.title || '';
    if (promptInput) promptInput.value = post.prompt || '';
    if (tagsInput) tagsInput.value = (post.tags || []).join(', ');
    if (urlInput) urlInput.value = post.liveUrl || '';
    if (descInput) descInput.value = post.description || '';

    modal.dataset.postId = postId;
    modal.classList.add('open');
  });
}

function saveEditPost(postId) {
  var modal = document.getElementById('editPostModal');
  var id = postId || (modal && modal.dataset.postId);
  if (!id) return;

  var titleInput = document.getElementById('editPostTitle');
  var promptInput = document.getElementById('editPostPrompt');
  var tagsInput = document.getElementById('editPostTags');
  var urlInput = document.getElementById('editPostUrl');
  var descInput = document.getElementById('editPostDescription');

  var updates = {};
  if (titleInput) updates.title = titleInput.value.trim();
  if (promptInput) updates.prompt = promptInput.value.trim();
  if (tagsInput) updates.tags = tagsInput.value.split(',').map(function(t) { return t.trim(); }).filter(Boolean);
  if (urlInput) updates.liveUrl = urlInput.value.trim();
  if (descInput) updates.description = descInput.value.trim();

  updatePost(id, updates).then(function() {
    if (modal) modal.classList.remove('open');
    if (typeof showToast === 'function') showToast('Vibe updated!');
    // Refresh My Vibes list
    openMyVibes();
  });
}

function confirmDeletePost(postId) {
  deletePost(postId).then(function() {
    // Refresh My Vibes list if modal is open
    var modal = document.getElementById('myVibesModal');
    if (modal && modal.classList.contains('open')) {
      openMyVibes();
    }
  });
}

// ══════════════════════════════════════════════════
// J. SHARE VIBE (ENHANCED submitVibe)
// ══════════════════════════════════════════════════

function submitVibe() {
  if (!currentUser) {
    if (typeof closeModal === 'function') closeModal();
    if (typeof openLogin === 'function') openLogin();
    return;
  }

  var titleInput = document.getElementById('vibeTitle');
  var promptInput = document.getElementById('vibePrompt');
  var tagsInput = document.getElementById('vibeTags');
  var urlInput = document.getElementById('vibeUrl');
  var descInput = document.getElementById('vibeDescription');

  var title = titleInput ? titleInput.value.trim() : '';
  var prompt = promptInput ? promptInput.value.trim() : '';
  var tagsRaw = tagsInput ? tagsInput.value.trim() : '';
  var liveUrl = urlInput ? urlInput.value.trim() : '';
  var description = descInput ? descInput.value.trim() : '';

  if (!title) {
    if (typeof showToast === 'function') showToast('Give your vibe a title!');
    return;
  }

  var tags = tagsRaw ? tagsRaw.split(',').map(function(t) { return t.trim(); }).filter(Boolean) : [];

  createPost({
    title: title,
    prompt: prompt,
    liveUrl: liveUrl,
    tags: tags,
    description: description,
    authorUid: currentUser.uid,
    authorName: currentProfile ? ('@' + currentProfile.username) : currentUser.displayName,
    authorUsername: currentProfile ? currentProfile.username : '',
    authorAvatar: currentProfile ? currentProfile.avatarUrl : (currentUser.photoURL || '')
  }).then(function() {
    if (typeof closeModal === 'function') closeModal();
    if (typeof showToast === 'function') showToast("Vibe posted! You're officially Claudicted.");

    // Clear form
    if (titleInput) titleInput.value = '';
    if (promptInput) promptInput.value = '';
    if (tagsInput) tagsInput.value = '';
    if (urlInput) urlInput.value = '';
    if (descInput) descInput.value = '';
  }).catch(function(error) {
    console.error('Error creating post:', error);
    if (typeof showToast === 'function') showToast('Failed to post. Please try again.');
  });
}

// ══════════════════════════════════════════════════
// K. USER MENU
// ══════════════════════════════════════════════════

function toggleUserMenu() {
  var dropdown = document.getElementById('userDropdown');
  if (!dropdown) return;
  dropdown.style.display = dropdown.style.display === 'none' ? 'block' : 'none';
}

// Close user menu on outside click
document.addEventListener('click', function(e) {
  var dropdown = document.getElementById('userDropdown');
  if (!dropdown) return;
  var trigger = e.target.closest('.user-menu-trigger');
  if (!trigger && dropdown.style.display !== 'none') {
    dropdown.style.display = 'none';
  }
});

// ══════════════════════════════════════════════════
// L. SEED SHOWCASE POSTS
// ══════════════════════════════════════════════════

function seedShowcasePosts() {
  // Check if showcase posts already exist
  db.collection('posts')
    .where('type', '==', 'showcase')
    .limit(1)
    .get()
    .then(function(snapshot) {
      if (!snapshot.empty) {
        console.log('Showcase posts already seeded.');
        return;
      }

      console.log('Seeding showcase posts...');
      var batch = db.batch();

      SHOWCASE_POSTS.forEach(function(post) {
        var ref = db.collection('posts').doc(); // auto-generated ID
        batch.set(ref, {
          showcaseId: post.showcaseId,
          title: post.title,
          prompt: post.prompt,
          tags: post.tags,
          authorName: post.authorName,
          authorInitials: post.authorInitials,
          authorGradient: post.authorGradient,
          authorTextColor: post.authorTextColor,
          views: post.views,
          likes: post.likes,
          likedBy: [],
          featured: post.featured || false,
          previewClass: post.previewClass,
          openFunction: post.openFunction,
          openBtnText: post.openBtnText,
          type: 'showcase',
          createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });
      });

      return batch.commit().then(function() {
        console.log('Showcase posts seeded successfully.');
        if (typeof showToast === 'function') showToast('Showcase posts loaded!');
      });
    })
    .catch(function(error) {
      console.error('Error seeding showcase posts:', error);
    });
}

// ══════════════════════════════════════════════════
// INIT — Start listeners on page load
// ══════════════════════════════════════════════════

document.addEventListener('DOMContentLoaded', function() {
  // Start real-time post listener
  listenToPosts();

  // Seed showcase posts on first load
  seedShowcasePosts();
});
